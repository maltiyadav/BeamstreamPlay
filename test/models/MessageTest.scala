package models
import org.scalatest.FunSuite
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import com.sun.org.apache.xalan.internal.xsltc.compiler.ForEach
import org.scalatest.BeforeAndAfter
import com.mongodb.casbah.commons.MongoDBObject

@RunWith(classOf[JUnitRunner])
class MessageTest extends FunSuite with BeforeAndAfter {

  val message1 = Message(100, "some message", MessageType.Audio, MessageAccess.Public, "time", 190, 290)
  val message2 = Message(101, "some message2", MessageType.Audio, MessageAccess.Public, "time", 190, 290)
  val message3 = Message(102, "some message3", MessageType.Audio, MessageAccess.Private, "time", 190, 290)

  before {
    Stream.createStream(Stream(290, "Beamstream stream", StreamType.Class, 190, List(190)))
    Message.createMessage(message1)
    Message.createMessage(message2)
    Message.createMessage(message3)

  }

  test("Fetch if the user was inserted") {
    val message = MessageDAO.findOneByID(id = 100)
    assert(message.get.text === "some message")

  }

  test("Fetch all messages for a stream") {
    val messages = Message.getAllMessagesForAStream(290)
    assert(messages.size === 3)

  }

  test("Fetch all messages for a user") {
    val messages = Message.getAllMessagesForAUser(190)
    assert(messages.size === 3)

  }

  test("Fetch all public messages for a user") {
    val messages = Message.getAllPublicMessagesForAUser(190)
    assert(messages.size === 2)

  }

  after {
    StreamDAO.remove(MongoDBObject("name" -> ".*".r))
    MessageDAO.remove(MongoDBObject("text" -> ".*".r))
  }

}