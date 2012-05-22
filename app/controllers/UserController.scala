package controllers
import play.api.mvc.Controller

import play.api._
import play.api.mvc._
import models.Quote
import models.Stream
import play.api.data._
import play.api.data.Forms._
import models.UserForm
import models.User
import models.User
import play.mvc.Http.Request
import play.libs._
import com.ning.http.client.Realm
import utils._
import org.bson.types.ObjectId
import net.liftweb.json.{ parse, DefaultFormats }
import net.liftweb.json.Serialization.{ read, write }

object UserController extends Controller {

  implicit val formats = DefaultFormats

  var s: String = ""

  /*
    * Map the fields value from html page 
    */
  val userForm = Form(
    mapping(
      "iam" -> nonEmptyText,
      "email" -> nonEmptyText,
      "password" -> nonEmptyText,
      "signup" -> nonEmptyText)(UserForm.apply)(UserForm.unapply))

  /*
 * Find and Authenticate the user to proceed
 */
  def findUser = Action { implicit request =>
    val userJsonMap = request.body.asFormUrlEncoded.get
    val user = userJsonMap("data").toList(0)

    val userJson = net.liftweb.json.parse(user)
    val userEmail = (userJson \ "email").extract[String]
    val userPassword = (userJson \ "password").extract[String]
    
    val authenticatedUser=User.findUser(userEmail ,userPassword) match {
      case Some(user) => 
        val aa = request.session + ("userId" -> user.id.toString)
        Ok
       
        
      case None => Redirect(routes.UserController.users)
    }
    
    

    //    userForm.bindFromRequest.fold(
    //      errors => BadRequest(views.html.user(User.allUsers(), errors, "")),
    //      userForm => {
    //
    //        (userForm.signup == "0") match {
    //
    //          case true =>
    //
    //            val initialFlashObject = request.flash + ("email" -> userForm.email)
    //            val FinalFlashObject = initialFlashObject + ("iam" -> userForm.iam)
    //            Redirect(routes.BasicRegistration.emailSent).flashing(FinalFlashObject)
    //
    //          case false =>
    //            val authenticatedUser = User.findUser(userForm)
    //            authenticatedUser match {
    //              case None =>
    //                s = "No User Found"
    //                Redirect(routes.UserController.users)
    //
    //              case _ =>
    //                s = "Login Successful"
    //
    //                /*Creates a Session*/
    //                val aa = request.session + ("userId" -> authenticatedUser.get.id.toString)
    //                User.activeUsers(authenticatedUser.get.id.toString)
    //                Redirect(routes.MessageController.messages).withSession(aa)
    //
    //            }
    //        }
    //
    //      })
    Ok
  }

  def users = Action { implicit request =>
    Ok(views.html.user(User.allUsers(), userForm, User.message(s)))
  }

  def registerUserViaSocialSite = Action { implicit request =>
    val tokenList = request.body.asFormUrlEncoded.get.values.toList(0)
    val token = tokenList(0)
    Authentication.Auth(token)

  }

  def signOut = Action { implicit request =>
    User.InactiveUsers(request.session.get("userId").get)
    Ok(views.html.user(User.allUsers(), userForm, User.message(s)))
  }

}