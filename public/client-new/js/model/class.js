/***
* BeamStream
*
* Author                : Aswathy P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 28/February/2013
* Description           : Backbone model for user's class
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/

define(['baseModel'], function(BaseModel) {
	var Class = BaseModel.extend({ 
		idAttribute: "_id",
		objName: 'Class',
		defaults:{
			schoolId: '',
			classCode: '',
			className: '',
			classTime: '',
			weekdays : '',
			startingDate: '10/10/2014',
			classType:'semester'
		},
		
		
		validation: {
			schoolId: {
				required: true
			},
			classCode: {
				required: true
			},
			className: {
				required: true
			},
			classTime: {
				required: true,
			}
		}

	});
        
	
	return Class;
});