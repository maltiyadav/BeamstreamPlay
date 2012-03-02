package models

import org.scalatest.FunSuite
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import com.sun.org.apache.xalan.internal.xsltc.compiler.ForEach
import org.scalatest.BeforeAndAfter
import com.mongodb.casbah.commons.MongoDBObject
import java.io.File
import com.mongodb.gridfs.GridFS
import com.mongodb.Mongo
import com.mongodb.BasicDBObject
import org.bson.types.ObjectId

@RunWith(classOf[JUnitRunner])
class MediaTest extends FunSuite with BeforeAndAfter {

  before {

    val imageFile1 = new File("/home/neel/Desktop/Shiv.jpg")
    val mongo = new Mongo("localhost", 27017)
    val db = mongo.getDB("beamstream")
    val collection = db.getCollection("media")
    val gfsPhoto = new GridFS(db, "photo")
    val gfsFile = gfsPhoto.createFile(imageFile1)
    gfsFile.save
    val media_id=gfsFile.getId().asInstanceOf[ObjectId]
    

    val mediaA = Media(001, 901, "VikasImage", MediaType.Image,media_id)
    Media.createMedia(mediaA)
   

  }

  test("Checking Media") {
    val mediaA = MediaDAO.findOneByID(001)
    assert(mediaA.get.mediaName === "VikasImage")
    assert(mediaA.get.mediaType === MediaType.Image)

  }

  after {
    MediaDAO.remove(MongoDBObject("mediaName" -> ".*".r))
  }
}