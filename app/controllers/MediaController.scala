package controllers
import play.api.mvc.Controller
import play.api.mvc.Action
import java.io.File
import com.mongodb.casbah.gridfs.GridFS
import utils.MongoHQConfig
import java.io.FileOutputStream
import models.MediaTransfer
import models.MediaType
import org.bson.types.ObjectId
import java.io.InputStream
import models.Profile
import utils.tokenEmail
import models.ResulttoSent
import net.liftweb.json.{ parse, DefaultFormats }
import net.liftweb.json.Serialization.{ read, write }
import utils.AmazonUpload
import utils.ObjectIdSerializer
import models.UserMedia
import models.UserMediaType
import models.ProfileImageProviderCache
import utils.CompressFile
import javax.imageio.ImageIO
import java.awt.image.BufferedImage
import utils.ExtractFrameFromVideo

object MediaController extends Controller {

  implicit val formats = new net.liftweb.json.DefaultFormats {
  } + new ObjectIdSerializer

  def getMedia = Action(parse.multipartFormData) { request =>

    val mediaJsonMap = request.body.asFormUrlEncoded.toMap
    val imageStatus = mediaJsonMap("imageStatus").toList(0).toBoolean
    val videoStatus = mediaJsonMap("videoStatus").toList(0).toBoolean

    (request.body.file("imageData").isEmpty) match {

      case true => // No Image Found
      case false =>
        // Fetch the image stream and details
        request.body.file("imageData").map { imageData =>
          val imageAuthenticationToken = tokenEmail.securityToken
          val imageFilename = imageData.filename
          val contentType = imageData.contentType.get
          val uniqueString = tokenEmail.securityToken
          val imageFileObtained: File = imageData.ref.file.asInstanceOf[File]
          val imageNameOnAmazon = uniqueString + imageFilename.replaceAll("\\s", "") // Security Over the images files
          val imageFileInputStream = CompressFile.compressImage(imageFileObtained, imageNameOnAmazon, 0.1f)
          //AmazonUpload.uploadFileToAmazon(imageNameOnAmazon, imageFileObtained)
          AmazonUpload.uploadCompressedFileToAmazon(imageNameOnAmazon, imageFileInputStream)
          val imageURL = "https://s3.amazonaws.com/BeamStream/" + imageNameOnAmazon
          val media = new UserMedia(new ObjectId, new ObjectId(request.session.get("userId").get), imageURL, UserMediaType.Image, imageStatus, "")
          UserMedia.saveMediaForUser(media)
          ProfileImageProviderCache.setImage(media.userId.toString, media.mediaUrl)
          // For MongoDB
          /*
      val profileImage: File = imageData.ref.file.asInstanceOf[File]
      val profileImageInputStream = new FileInputStream(profileImage)
      new mediaComposite(imageFilename, contentType.get, profileImageInputStream)
      */
        }.get

    }

    (request.body.file("videoData").isEmpty) match {
      case true => // No Video Found
      case false =>
        // Fetch the video stream and details
        request.body.file("videoData").map { videoData =>
          val videoAuthenticationToken = tokenEmail.securityToken
          val videoFilename = videoData.filename
          val contentType = videoData.contentType.get
          val uniqueString = tokenEmail.securityToken
          val videoFileObtained: File = videoData.ref.file.asInstanceOf[File]
          val videoFileNameOnnAmazon = uniqueString + videoFilename.replaceAll("\\s", "") // Security Over the videos files
          println(videoFileNameOnnAmazon)
          AmazonUpload.uploadFileToAmazon(videoFileNameOnnAmazon, videoFileObtained)
          val videoURL = "https://s3.amazonaws.com/BeamStream/" + videoFileNameOnnAmazon

          val frameOfVideo = ExtractFrameFromVideo.extractFrameFromVideo(videoURL)
          AmazonUpload.uploadCompressedFileToAmazon(videoFileNameOnnAmazon + "Frame", frameOfVideo)
          val videoFrameURL = "https://s3.amazonaws.com/BeamStream/" + videoFileNameOnnAmazon + "Frame"

          val media = new UserMedia(new ObjectId, new ObjectId(request.session.get("userId").get), videoURL, UserMediaType.Video, videoStatus, videoFrameURL)
          UserMedia.saveMediaForUser(media)
          /*
      val profileVideo: File = videoData.ref.file.asInstanceOf[File]
      val profileVideoInputStream = new FileInputStream(profileVideo)
      new mediaComposite(videoFilename, contentType.get, profileVideoInputStream)
    */
        }.get
    }

    /*
    val mediaTransfrerObject = new MediaTransfer(new ObjectId(request.session.get("userId").get), MediaType.Image, true,
    imageComposite.inputStream, imageComposite.name, videoComposite.inputStream, videoComposite.name, mobileNo, uploadType)
    Profile.createMedia(mediaTransfrerObject)
    */

    Ok(write(new ResulttoSent("Success", "Profile Photo Uploaded Successfully"))).as("application/json")
  }

  /*
   * obtaining the profile Picture
   * @ Purpose: fetches the recent profile picture for a user
   */

  def getProfilePicForAUser = Action { implicit request =>
    val userIdJsonMap = request.body.asFormUrlEncoded.get
    val userIdReceived = userIdJsonMap("userId").toList(0)
    //    if (ProfileImageProviderCache.profileImageMap.isDefinedAt(userIdReceived)) {
    //      val profilePicUrl = ProfileImageProviderCache.getImage(userIdReceived)
    //      Ok(write(profilePicUrl)).as("application/json")
    //    } else {
    //      val mediaObtained = UserMedia.getProfilePicForAUser(new ObjectId(userIdReceived))
    //      if (!mediaObtained.size.equals(0)) {
    //        val MediaJson = write(mediaObtained.last)
    //        Ok(MediaJson).as("application/json")
    //      }
    val mediaObtained = UserMedia.getProfilePicForAUser(new ObjectId(userIdReceived))
    if (!mediaObtained.size.equals(0)) {
      val MediaJson = write(mediaObtained.last)
      Ok(MediaJson).as("application/json")
    } else {
      Ok(write(new ResulttoSent("Failure", "No picture found for this user")))
    }

  }

  /*
   * Get All Photos for a user
   */
  def getAllProfilePicForAUser = Action { implicit request =>
    val allProfileMediaForAUser = UserMedia.getAllProfilePicForAUser(new ObjectId(request.session.get("userId").get))
    Ok(write(allProfileMediaForAUser)).as("application/json")
  }

  /*
   * Get All Video for a user for a user
   * @Purpose : Show all Video For A User
   */
  def getAllProfileVideoForAUser = Action { implicit request =>
    val allProfileMediaForAUser = UserMedia.getAllProfileVideoForAUser(new ObjectId(request.session.get("userId").get))
    Ok(write(allProfileMediaForAUser)).as("application/json")
  }

}