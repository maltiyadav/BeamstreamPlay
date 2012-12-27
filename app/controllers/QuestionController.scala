package controllers
import play.api.mvc.Controller
import play.api._
import play.api.mvc._
import play.api.mvc.Response
import models.Stream
import play.api.data._
import play.api.data.Forms._
import play.api.Play.current
import models.User
import org.bson.types.ObjectId
import play.api.cache.Cache
import models.Media
import models.UserType
import java.io.File
import java.util.Date
import models.QuestionAccess
import models.Message
import models.User
import models.Question
import net.liftweb.json.{ parse, DefaultFormats }
import net.liftweb.json.Serialization.{ read, write }
import java.text.SimpleDateFormat
import utils.EnumerationSerializer
import utils.ObjectIdSerializer
import java.net.URL
import models.ResulttoSent
import play.api.libs.json._
import models.OptionOfQuestion
import models.OptionOfQuestionDAO
import models.QuestionPolling

/**
 * This controller class is used to store and retrieve all the information about Question and Answers.
 *
 * @author Kishen
 */

object QuestionController extends Controller {

  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter = new SimpleDateFormat("MM/dd/yyyy")
  } + new ObjectIdSerializer

  /*
 * 
 * Asking A New Question
 */

  def newQuestion = Action { implicit request =>

    val questionJsonMap = request.body.asFormUrlEncoded.get
    println(questionJsonMap)

    val streamId = questionJsonMap("streamId").toList(0)
    val questionBody = questionJsonMap("questionBody").toList(0)
    val questionAccess = questionJsonMap("questionAccess").toList(0)
    val pollsOptions = questionJsonMap("pollsOptions").toList(0)
    
    val userId = new ObjectId(request.session.get("userId").get)
    val user = User.getUserProfile(userId)
    val questionToAsk = new Question(new ObjectId, questionBody, userId,
      QuestionAccess.withName(questionAccess), new ObjectId(streamId), user.firstName, user.lastName, new Date, 0, List(), List(), List(), List())
    val questionId = Question.addQuestion(questionToAsk)
    val pollsList=pollsOptions.split(",").toList
    /**
     * Add  Poll To Question
     */
    if (questionJsonMap.contains(("pollsOptions"))) {
      for (pollsOption <- pollsList) {
         println("**** Create Poll")
         println(pollsOption)
        val optionOfPoll = new OptionOfQuestion(new ObjectId, pollsOption, List())
        val optionOfAPollId = OptionOfQuestionDAO.insert(optionOfPoll)
        //Question.addPollToQuestion(optionOfAPollId.get, questionId)
        println("**** Done Poll")
      }
    }

    val questionObtained = Question.findQuestionById(questionId)
    Ok(write(List(questionObtained))).as("application/json")

  }

  /**
   * Get All Questions For A User
   */

  def getAllQuestionsForAUser = Action { implicit request =>
    val questionIdJsonMap = request.body.asFormUrlEncoded.get
    val allQuestionsForAUser = Question.getAllQuestionsForAUser(new ObjectId(request.session.get("userId").get))
    val allQuestionForAStreamJson = write(allQuestionsForAUser)
    Ok(write(allQuestionForAStreamJson)).as("application/json")
  }

  /**
   * Rock the Question
   */
  def rockTheQuestion = Action { implicit request =>
    val questionIdJsonMap = request.body.asFormUrlEncoded.get
    val id = questionIdJsonMap("questionId").toList(0)
    val totalRocks = Question.rockTheQuestion(new ObjectId(id), new ObjectId(request.session.get("userId").get))
    val totalRocksJson = write(totalRocks.toString)
    Ok(write(totalRocksJson)).as("application/json")
  }

  /**
   * Rockers of a Question
   */
  def giveMeRockers = Action { implicit request =>
    val questionIdJsonMap = request.body.asFormUrlEncoded.get
    val id = questionIdJsonMap("questionId").toList(0)
    val rockers = Question.rockersNameOfAQuestion(new ObjectId(id))
    val rockersJson = write(rockers)
    Ok(write(rockersJson)).as("application/json")
  }
  /**
   * Follow Question
   */

  def followQuestion = Action { implicit request =>
    val questionIdJsonMap = request.body.asFormUrlEncoded.get
    val questionId = questionIdJsonMap("questionId").toList(0)
    val followers = Question.followQuestion(new ObjectId(request.session.get("userId").get), new ObjectId(questionId))
    Ok(write(followers.toString)).as("application/json")
  }

  /**
   * Vote an option of a question (Polling)
   */
  def voteAnOptionOfAQuestion = Action { implicit request =>
    val optionOfAQuestionIdJsonMap = request.body.asFormUrlEncoded.get
    val optionOfAQuestionId = optionOfAQuestionIdJsonMap("optionOfAQuestionId").toList(0)
    val votes = QuestionPolling.voteTheOptionOfAQuestion(new ObjectId(optionOfAQuestionId), new ObjectId(request.session.get("userId").get))
    Ok(write(votes.toString)).as("application/json")
  }

}

