package controllers
import play.api.mvc.Controller
import play.api._
import play.api.mvc._
import play.api.mvc.Response
import models.Stream
import play.api.data._
import play.api.data.Forms._
import play.api.Play.current
import models.Message
import models.User
import org.bson.types.ObjectId
import play.api.cache.Cache
import models.Media
import com.mongodb.gridfs.GridFSDBFile
import models.UserType
import java.io.File
import play.api.libs.iteratee.Enumerator
import java.util.Date
import models.MessageAccess
import models.MessageType
import net.liftweb.json.{ parse, DefaultFormats }
import net.liftweb.json.Serialization.{ read, write }
import java.text.SimpleDateFormat
import utils.EnumerationSerializer
import utils.ObjectIdSerializer

object MessageController extends Controller {

//  implicit val formats = DefaultFormats
   implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter = new SimpleDateFormat("MM/dd/yyyy")
  }  + new ObjectIdSerializer

  //==========================//
  //======Post a new message==//
  //==========================//

  def newMessage = Action { implicit request =>
    val messageListJsonMap = request.body.asFormUrlEncoded.get
    val streamId = messageListJsonMap("streamId").toList(0)
    val messageAccess = messageListJsonMap("messageAccess").toList(0)
    val messageBody = messageListJsonMap("message").toList(0)
    val messagePoster = User.getUserProfile(new ObjectId(request.session.get("userId").get))
    val messageToCreate = new Message(new ObjectId, messageBody, MessageType.Audio, MessageAccess.withName(messageAccess), new Date, new ObjectId(request.session.get("userId").get), new ObjectId(streamId),
    messagePoster.firstName, messagePoster.lastName, 0, List())
    val messageId=Message.createMessage(messageToCreate)
    val messageObtained = Message.findMessageById(messageId)
    val messageJson = write(List(messageObtained))
    Ok(messageJson).as("application/json")
  }

  def messages = Action { implicit request =>
    val profileName = User.getUserProfile((new ObjectId(request.session.get("userId").get)))
    val streams = Stream.getAllStreamforAUser(new ObjectId(request.session.get("userId").get))
    Ok
  }

  def streamMessages(id: String) = Action { implicit request =>
    val profileName = User.getUserProfile(new ObjectId(request.session.get("userId").get))
    val streams = Stream.getAllStreamforAUser(new ObjectId(request.session.get("userId").get))
    val messagesListFound = Message.getAllMessagesForAStream(new ObjectId(id))
    Ok
  }

  //==================================================//
  //======Displays all the messages within a Stream===//
  //==================================================//
  def getAllMessagesForAStream = Action { implicit request =>
    val streamIdJsonMap = request.body.asFormUrlEncoded.get
    val streamId = streamIdJsonMap("streamId").toList(0)
    val allMessagesForAStream = Message.getAllMessagesForAStream(new ObjectId(streamId))
    val allMessagesForAStreamJson = write(allMessagesForAStream)
    Ok(allMessagesForAStreamJson).as("application/json")
  }
  
  /*
   * Rock the message
   */
   def rockedTheMessage = Action { implicit request =>
     val messageIdJsonMap = request.body.asFormUrlEncoded.get
     val messageId = messageIdJsonMap("messageId").toList(0)
     val totalRocks=Message.rockedIt(new ObjectId(messageId),new ObjectId(request.session.get("userId").get))
     val totalRocksJson=write(totalRocks.toString)
     Ok(totalRocksJson).as("application/json")
   }
   
   /*
    * Rockers of message
    */
   def giveMeRockers =  Action { implicit request =>
     val messageIdJsonMap = request.body.asFormUrlEncoded.get
     val messageId = messageIdJsonMap("messageId").toList(0)
     val weAreRockers=Message.rockersNames(new ObjectId(messageId))
     val WeAreRockersJson=write(weAreRockers)
     Ok(WeAreRockersJson).as("application/json")
   }
   

}

