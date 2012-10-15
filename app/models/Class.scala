package models

import org.joda.time.DateTime
import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import com.novus.salat.dao._
import com.mongodb.casbah.Imports._
import com.mongodb.casbah.MongoConnection
import com.mongodb.casbah.commons.conversions.scala._
import org.bson.types.ObjectId
import utils.MongoHQConfig
import java.util.Date
import java.util.regex.Pattern
import java.text._
import net.liftweb.json.{ parse, DefaultFormats }
import net.liftweb.json.Serialization.{ read, write }
import utils.ObjectIdSerializer

case class Class(@Key("_id") id: ObjectId,
  classCode: String,
  className: String,
  classType: ClassType.Value,
  classTime: String,
  startingDate: Date,
  schoolId: ObjectId,
  streams: List[ObjectId])

object Class {

  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")
  implicit val formats = DefaultFormats
  /*
   * Create the new Classes
   */
  def createClass(classList: List[Class], userId: ObjectId): ResulttoSent = {

    /*
 * Check if the duplicate code exists in database
 * @if yes then return true else return false
 * Local Function for duplication removal
 */

    /*
   * is Duplicate Class Exists In List (Local Function)
   */
    def duplicateClassExistesInSubmittedList(classList: List[Class]): Boolean = {
      var classFetchCount: Int = 0
      for (eachClass <- classList) {
        val classFetchedbyFilteringClassCode = classList.filter(x => x.classCode == eachClass.classCode)
        val classFetchedbyFilteringClassName = classList.filter(x => x.className == eachClass.className)
        if (classFetchedbyFilteringClassCode.size > 1 || classFetchedbyFilteringClassName.size > 1) classFetchCount += 1
      }
      if (classFetchCount == 0) false else true
    }

    //Class Creation Starts Here by calling the duplicate code validation method
    if (duplicateClassExistesInSubmittedList(classList) == true) ResulttoSent("Failure", "Duplicates Class Code or Name Provided")

    else {

      //TODO:var classIdList: List[ObjectId] = List()

      for (eachclass <- classList) {
        println(eachclass)
        val classesobtained = Class.findClassListById(eachclass.id)
        if (!classesobtained.isEmpty) {
          println("Join Stream Case")
          Stream.joinStream(classesobtained(0).streams(0), userId)
          User.addClassToUser(userId, List(eachclass.id))

          val classObtained = Class.findClassListById(eachclass.id)
          ClassDAO.update(MongoDBObject("_id" -> eachclass.id), classObtained(0).copy(
            classCode = eachclass.classCode,
            className = eachclass.className,
            classType = eachclass.classType,
            classTime = eachclass.classTime,
            schoolId=eachclass.schoolId,
            startingDate = eachclass.startingDate), false, false, new WriteConcern)
          val streamOfTheComingClass = Stream.findStreamById(classObtained(0).streams(0))
          StreamDAO.update(MongoDBObject("_id" -> classObtained(0).streams(0)), streamOfTheComingClass.copy(streamName = eachclass.className), false, false, new WriteConcern)

        } else {
          println("Create class Case")
          val classId = ClassDAO.insert(eachclass)
          User.addClassToUser(userId, List(new ObjectId(classId.get.toString)))
          // Create the Stream for this class
          val streamToCreate = new Stream(new ObjectId, eachclass.className, StreamType.Class, userId, List(userId), true, List())
          val streamId = Stream.createStream(streamToCreate)
          Stream.attachStreamtoClass(streamId, new ObjectId(classId.get.toString))
        }
      }
      ResulttoSent("Success", "User has successfully added his classes")
    }
  }

  /*
   * Delete A Class
   * @Purpose Delete A Class
   */
  def deleteClass(myclass: Class) {
    ClassDAO.remove(myclass)
  }


  /*
   * Finding the class by Code
   */

  def findClassByCode(code: String, schoolId: ObjectId): List[Class] = {
    val codePattern = Pattern.compile("^" + code, Pattern.CASE_INSENSITIVE)
    var classes: List[Class] = List()
    val classFound = ClassDAO.find(MongoDBObject("schoolId" -> schoolId, "classCode" -> codePattern)).toList
    (classFound.isEmpty) match {
      case true =>
      case false => classes ++= classFound
    }
    classes
  }

  /*
   * Finding the class by Code
   */

  def findClassByName(name: String, schoolId: ObjectId): List[Class] = {
    val namePattern = Pattern.compile("^" + name, Pattern.CASE_INSENSITIVE)
    var classes: List[Class] = List()
    val classFound = ClassDAO.find(MongoDBObject("schoolId" -> schoolId, "className" -> namePattern)).toList
    (classFound.isEmpty) match {
      case true =>
      case false => classes ++= classFound
    }
    classes
  }

//  /*
//   * Get class by code
//   * 
//   */
//  def getClassByCode(classToSearch: Class): List[Class] = {
//    val classesFetched = ClassDAO.find(MongoDBObject("classCode" -> classToSearch.classCode)).toList
//    classesFetched
//  }

  /*
   * Finding the class by Time
   */

  def findClassByTime(time: String): List[Class] = {
    val regexp = (""".*""" + time + """.*""").r
    for (theclass <- ClassDAO.find(MongoDBObject("classTime" -> regexp)).toList) yield theclass
  }

  /*
   * Find a class by Id
   */

  def findClasssById(classId: ObjectId): Class = {
    val classObtained = ClassDAO.find(MongoDBObject("_id" -> classId)).toList(0)
    classObtained
  }

  /*
   * Find a class List by Id
   */

  def findClassListById(classId: ObjectId): List[Class] = {
    val classObtained = ClassDAO.find(MongoDBObject("_id" -> classId)).toList
    classObtained
  }

  /*
   * Get all classes for a user
   */
  def getAllClassesIdsForAUser(userId: ObjectId): List[ObjectId] = {
    val user = UserDAO.find(MongoDBObject("_id" -> userId)).toList(0)
    user.classId

  }

  /*
   * get all class List
   */

  def getAllClasses(classIdList: List[ObjectId]): List[Class] = {
    var classList: List[Class] = List()
    for (classId <- classIdList) {
      val classObtained = ClassDAO.find(MongoDBObject("_id" -> classId)).toList
      classList ++= classObtained
    }
    classList
  }

  /*
   * @Purpose :   Getting All Classes for a user
   * 
   */
  def getAllClassesForAUser(userId: ObjectId): List[Class] = {
    val classesIdsOfAUser = Class.getAllClassesIdsForAUser(userId)
    val classesOfAUser = getAllClasses(classesIdsOfAUser)
    classesOfAUser
  }

  /**
   * Get All Refreshed Classes
   */

  def getAllRefreshedClasss(classes: List[Class]): List[Class] = {
    var classList: List[Class] = List()
    for (eachClass <- classes) {
      val classObtained = ClassDAO.find(MongoDBObject("_id" -> eachClass.id)).toList
      classList ++= classObtained
    }
    classList
  }

}

object ClassType extends Enumeration {
  val Semester = Value(0, "semester")
  val Quarter = Value(1, "quarter")
  val Yearly = Value(2, "yearly")
}

object ClassDAO extends SalatDAO[Class, Int](collection = MongoHQConfig.mongoDB("class"))