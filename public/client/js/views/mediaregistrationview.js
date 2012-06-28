BS.MediaRegistrationView = Backbone.View.extend({

	events : {
		"click #save" : "save",
		"click #continue" : "toNextPage",
	},

	initialize : function() {
		 
		console.log('Initializing Basic Registration via Social site ');
		this.source = $("#tpl-profile-socialmedia").html();
		this.template = Handlebars.compile(this.source);

	},

	render : function(eventName) {
	   
		 $(this.el).html(this.template);
		 return this;
		
	},

	/**
	 * Post /save basic registration details
	 */

	save : function(eventName) {
		eventName.preventDefault();
		var validate = jQuery('#social-media-signup').validationEngine('validate');
        
        if(validate == true){
    	    var regDetails = this.getFormData();
    	    // valid I'm field
            if(regDetails == false)
            {
            	console.log("Please fill I'm field");
            	$('#error').html("Please select  I'm field");
            }
            else
            {
            	if(regDetails == 1)
            	{
            		$('#school-email').val("");
            		$('#school-email').focus();
                	$('#error').html("Invalid Email address");
            	}
            	else
            	{
            		
             
	            	/* post basic profile registration details */
	       			$.ajax({
	    	   			type : 'POST',
	    	   			url : BS.registerNewUser,
	    	   			data : {
	    	   				data : regDetails
	    	   			},
	    	   			dataType : "json",
	    	   			success : function(data) {
	    	   				if (data.status == "Success") {
	    	   					// navigate to main stream page
	    	   					BS.AppRouter.navigate("streams", {
	    	   						trigger : true,
	    	   						replace : true
	    	   					});
	    	   					console.log(data.message);
	    	   				} else {
	    	   					console.log(data.message);
	    	   				}
	    	
	    	   			}
	       		    });
            	}
            }
    	   
        }
        else
        {
        	console.log("Fields are not completely filled");
        	$('#error').html("Fields are not completely filled");
        }
       
		
	},

	/**
	 * get all form data
	 */
	getFormData : function() {
      
		var basicProfile = new BS.BasicProfile();
		var useCurrentLocation;
		if ($('#useCurrentLocation').attr('checked') == "checked") {
			useCurrentLocation = true;
		} else {
			useCurrentLocation = false;
		}
		//get values of 'I'm' and email for janRain Login
         if($('#iam').val() == "" )
         {
        	  
        		return false;
         }
         var schoolEmail = $('#school-email').val();
         var emailregex =/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i;
         if(schoolEmail.match(emailregex))
         {
			basicProfile.set({
				iam : $('#iam').val(),
				email : $('#school-email').val(),
				schoolName : $('#school-name').val(),
				userName : $('#user-name').val(),
				password : $('#password').val(),
				firstName : $('#first-name').val(),
				lastName : $('#last-name').val(),
				location : $('#location').val(),
				useCurrentLocation : useCurrentLocation,
	
			});
			var regDetails = JSON.stringify(basicProfile);
	
			return regDetails;
         }
         else
         {
        	 return 1;
         }

	},

	/**
	 * continue to next page
	 */

	toNextPage : function(eventName) {

		eventName.preventDefault();
        var validate = jQuery('#registration-form').validationEngine('validate');
        
        if(validate == true){
        
			var regDetails = this.getFormData();
	
			/* post basic profile registration details */
			$.ajax({
				type : 'POST',
				url : BS.registerNewUser,
				data : {
					data : regDetails
				},
				dataType : "json",
				success : function(data) {
					if (data.status == "Success") {
						// navigate to main stream page
						BS.AppRouter.navigate("school", {
							trigger : true,
							replace : true
						});
						console.log(data.message);
					} else {
						console.log(data.message);
					}
	
				}
			});
        }
        else
        {
        	console.log("Fields are not completly filled");
        	$('#error').html("Fields are not completly filled");
        }
	},

});
