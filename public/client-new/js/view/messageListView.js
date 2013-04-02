/***
* BeamStream
*
* Author                : Aswathy P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 28/February/2013
* Description           : View for Message List on discussion page
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/

define(['view/formView'],function(FormView ){
	
	var messageListView;
	messageListView = FormView.extend({
		objName: 'messageListView',
		messagesPerPage: 10,
		pageNo: 0,
		events:{
		},

		onAfterInit: function(){	
			this.data.reset();
        },
        
        onAfterRender: function(){
        	$('.comment-wrapper').hide();
        	
        },
        
        displayNoResult : function(callback) {
			this.animate.effect = "fade";
			this.$(".content").html("");
		},
		
        
       
	})
	return messageListView;
});