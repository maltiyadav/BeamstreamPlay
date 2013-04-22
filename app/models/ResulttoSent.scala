package models
import java.io.InputStream
import com.novus.salat.dao.SalatDAO
import com.novus.salat.annotations._
import org.bson.types.ObjectId
import com.novus.salat.global._
import utils.MongoHQConfig

/*
 * JSON format for response 
 * @purpose :  Success or failure
 */
case class ResulttoSent(status: String,
  message: String)

//Resultant Class Details
case class ClassWithNoOfUsers(usersMap: Map[String, Int],
  classToReturn: Class)

case class OptionOfQuestion(@Key("_id") id: ObjectId,
  name: String,
  voters: List[ObjectId])

case class OnlineUsers(@Key("_id") id: ObjectId, firstName: String, lastName: String, profileImageUrl: String)

object OptionOfQuestionDAO extends SalatDAO[OptionOfQuestion, ObjectId](collection = MongoHQConfig.mongoDB("optionofquestion"))

/**
 * Question With Polls
 */
case class QuestionWithPoll(question: Question, var profilePic: Option[String] = None, var comments: Option[List[Comment]] = None, polls: List[OptionOfQuestion])

/**
 * Document Results After Uploading From Main Stream
 */
case class DocResulttoSent(message: Message, docName: String, docDescription: String, var profilePic: Option[String] = None, var comments: Option[List[Comment]] = None)

/**
 * User & User School details after Registration
 */
case class RegistrationResults(user: User, userSchool: UserSchool)

/**
 * Stream Result
 */

//TODO :Extra 
case class StreamResult(stream: Stream, usersOfStream: Int)
case class ClassResult(stream: Stream, resultToSend: ResulttoSent)

case class LoginResult(result: ResulttoSent, user: Option[User], profilePicOfUser: Option[String])
