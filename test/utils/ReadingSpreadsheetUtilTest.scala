package utils

import org.scalatest.FunSuite
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import play.api.test.Helpers.running
import play.api.test.FakeApplication
import java.io.File
import models.SchoolDAO
import com.mongodb.casbah.commons.MongoDBObject
import org.scalatest.BeforeAndAfter

@RunWith(classOf[JUnitRunner])
class ReadingSpreadsheetUtilTest extends FunSuite with BeforeAndAfter {

  before {
    running(FakeApplication()) {
      SchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
    }
  }

  test("Reading List of Schools csv file") {
    running(FakeApplication()) {
      object ReadingSpreadsheetUtilTest extends ReadingSpreadsheetUtilTest
      val filePath = ReadingSpreadsheetUtilTest.getClass().getClassLoader().getResource("ListofSchools.csv")
      ReadingSpreadsheetUtil.readCSVOfSchools(new File(filePath.toURI()))
      assert(SchoolDAO.find(MongoDBObject()).toList.size >= 7487)
    }
  }
  
  after {
    running(FakeApplication()) {
      SchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
    }
  }
}