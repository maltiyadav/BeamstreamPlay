package utils

import scala.collection.JavaConversions.asScalaBuffer
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential
import com.google.api.client.http.FileContent
import com.google.api.client.http.javanet.NetHttpTransport
import com.google.api.client.json.jackson.JacksonFactory
import com.google.api.services.drive.Drive
import com.google.api.services.drive.model.File
object GoogleDocsUploadUtility {

  val CLIENT_ID = "213363569061.apps.googleusercontent.com"
  val CLIENT_SECRET = "d3s0YP7_xtCaAtgCiSy_RNdU"
  val httpTransport = new NetHttpTransport
  val jsonFactory = new JacksonFactory
  /**
   * Set Up Google App Credentials
   */
  def prepareGoogleDrive(accessToken: String): Drive = {

    //Build the Google credentials and make the Drive ready to interact
    val credential = new GoogleCredential.Builder()
      .setJsonFactory(jsonFactory)
      .setTransport(httpTransport)
      .setClientSecrets(CLIENT_ID, CLIENT_SECRET)
      .build();
    credential.setAccessToken(accessToken);
    //Create a new authorized API client
    new Drive.Builder(httpTransport, jsonFactory, credential).build()
  }

  /**
   * Upload To Google Drive
   */
  def uploadToGoogleDrive(accessToken: String, fileToUpload: java.io.File, fileName: String, contentType: String): String = {
    val service = prepareGoogleDrive(accessToken)
    //Insert a file  
    val body = new File
    body.setTitle(fileName)
    body.setDescription(fileName)
    body.setMimeType(contentType)
    val fileContent: java.io.File = fileToUpload
    val mediaContent = new FileContent(contentType, fileContent)
    //Inserting the files
    val file = service.files.insert(body, mediaContent).execute()
    println("File Uploaded")
    file.getId

  }
  /**
   * Get All Files From Google Drive
   */

  def getAllDocumentsFromGoogleDocs(code: String): List[(String, String)] = {
    val service = prepareGoogleDrive(code)
    var result: List[File] = Nil
    val request = service.files.list

    do {
      val files = request.execute
      result ++= (files.getItems)
      request.setPageToken(files.getNextPageToken)
    } while (request.getPageToken() != null && request.getPageToken().length() > 0)

    result map {
      case a => (a.getOriginalFilename, a.getAlternateLink)
    }
  }

  /**
   * Get Access token Using refresh Token
   */

  def getNewAccessToken(refreshToken: String):String = {
    val credentialBuilder = new GoogleCredential.Builder()
      .setTransport(httpTransport).setJsonFactory(jsonFactory)
      .setClientSecrets(CLIENT_ID, CLIENT_SECRET);

    val credential = credentialBuilder.build()
    credential.setRefreshToken(refreshToken)
    credential.refreshToken()
    credential.getAccessToken
  }

}