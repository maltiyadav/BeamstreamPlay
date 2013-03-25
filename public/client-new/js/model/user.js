/***
* BeamStream
*
* Author                : Aswathy P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 29/January/2013
* Description           : Backbone model for user details 
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/

define(['baseModel'], function(BaseModel) {
	var User = BaseModel.extend({ 
		objName: 'User',
        defaults: {	   
        	
            firstName: '',
			lastName: '',
			schoolName: '',
			major: '',
			gradeLevel: '',
			degreeProgram: '',
			graduate: '',
			location: '',
			cellNumber: ''

        },
        /**
         *@TODO  parse the response data because the response json is different
         */
        parse:function(response){
        	
        	// @TODO some case we don't need to parse the response 
        	if(response == "Oops there were errors during registration" || response.message)
        		return;
        	response.id = response.user.id.id;
        	response.firstName = response.user.firstName;
        	response.lastName = response.user.lastName;
        	response.major = response.userSchool.major;
        	response.aboutYourself = response.user.about;
        	response.gradeLevel = response.userSchool.year.name;
        	response.degreeProgram = response.userSchool.degree.name;
        	response.graduate = response.userSchool.graduated.name;
        	response.location = response.user.location;
        	response.cellNumber = response.user.contact;
        	
        	delete response.user;
        	delete response.userSchool;
        	return response;
        },
        
		validation: {

            firstName: {
				required: true
			},
			lastName: {
				required: true
			},
			schoolName: {
				required: true
			},
			major: {
				required: true
			},
			gradeLevel: {
				required: true
			},
			degreeProgram: {
				required: true
			},
			graduate: {
				required: true
			},
			location: {
				required: true
			},
			cellNumber: {				
                pattern: 'phone'
			},
			otherDegree:{
				required: true
			},
			graduationDate: {
				required: true
			},
			degreeExpected:{
				required: true
			}
        }
  

	});
        
	return User;
});