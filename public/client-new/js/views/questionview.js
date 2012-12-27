/***
	 * BeamStream
	 *
	 * Author                : Aswathy .P.R (aswathy@toobler.com)
	 * Company               : Toobler
	 * Email:                : info@toobler.com
	 * Web site              : http://www.toobler.com
	 * Created               : 27/November/2012
	 * Description           : Backbone view for stream Questions page
	 * ==============================================================================================
	 * Change History:
	 * ----------------------------------------------------------------------------------------------
	 * Sl.No.  Date   Author   Description
	 * ----------------------------------------------------------------------------------------------
	 *
	 * 
     */
	BS.QuestionView = Backbone.View.extend({
	
		events : {
			 "click #post-question" : "postQuestion",
			 "keypress #Q-area" : "postQuestionOnEnterKey",
			 "click #sortBy-list" : "sortQuestions",
			 "click #date-sort-list" : "sortQuestionsWithinAPeriod",
			 "click .add-poll " : "addPollOptionsArea",
			 "click .add-option" : "addMorePollOptions",
			 "click #private-to" : "checkPrivateAccess",
			 "click #private-to-list li" :"selectPrivateToList",
			 "click #share-discussions li a" : "actvateShareIcon",
			 "click #question-file-upload li " : "uploadFiles",
			 "change #upload-files-area" : "getUploadedData",
			 "click .add-comment" : "showCommentTextArea",
			 "click .follow-question" : "followQuestion",
			 "click .rocks-question" : "rockQuestion",
			 "click .follow-user" : "followUser",
			 "click .who-rocked-it" : "showRockersList",
		},
	
		initialize : function() {
			
			console.log('Initializing QuestionView');
			this.source = $("#tpl-questions-middle-contents").html();
			this.template = Handlebars.compile(this.source);
			 
		},
		
		/**
		 * render class Info screen
		 */
		render : function(eventName) {
		    
			$(this.el).html(this.template);
			return this;
		},
		
		 /**
	     * NEW THEME - post questions on enter key
	     */
	    postQuestionOnEnterKey: function(eventName){
	    	
	    	var self = this;
			 
			if(eventName.which == 13) {
				self.postQuestion(); 
			}
			if(eventName.which == 32){
				 
				var text = $('#Q-area').val();
			    var links =  text.match(BS.urlRegex); 
					 
			    /* create bitly for each url in text */
				if(links)
				{
						 
					if(!BS.urlRegex2.test(links[0])) {
						urlLink = "http://" + links[0];
				  	}
			     	else
			     	{
			    		urlLink =links[0];
			     	}
						 
					//To check whether it is google docs or not
					if(!urlLink.match(/^(https:\/\/docs.google.com\/)/))  
		            { 
						/* don't create bitly for shortened  url */
						if(!urlLink.match(/^(http:\/\/bstre.am\/)/))
						{
							/* create bitly  */
							$.ajax({
				    			type : 'POST',
				    			url : BS.bitly,
				    			data : {
				    				 link : urlLink 
				    			},
				    			dataType : "json",
				    			success : function(data) {
				    				 var qst = $('#qst-area').val();
				    				 question = msg.replace(links[0],data.data.url);
				    				 $('#Q-area').val(question);
						    				
				    			}
				    		});

							$('#Q-area').preview({key:'4d205b6a796b11e1871a4040d3dc5c07'});
						          
				        }
		            }
			    }
		 	}
    	},
		
		/**
		 * function for post questions 
		 */
		postQuestion: function(eventName){
			
//			eventName.preventDefault();
			var question = $('#Q-area').val();
			 
			if(!question.match(/^[\s]*$/))
			{
				var streamId =  $('.sortable li.active').attr('id');
				 
				var questionAccess;
		        var queAccess =  $('#private-to').attr('checked');
		        var privateTo = $('#select-privateTo').text();
		        
			    if(queAccess == "checked")
			    {
			    	if(privateTo == "My School")
			    	{
			    		questionAccess = "PrivateToSchool";
			    	}
			    	else
			    	{
			    		questionAccess = "PrivateToClass";
			    	}
			    	
			    }
			    else
			    {
			    	questionAccess = "Public";
			    }
			    
			    
			    
			    var pollOptions ='';
			 
			    for (var i=1; i<= BS.options ; i++)
			    {
			    	pollOptions+= $('#option'+i).val()+',' ;
			    	$('#option'+i).val('');
			    }
			    pollOptions = pollOptions.substring(0, pollOptions.length - 1);
			    
			    //get poll options
			    var info ;
			    if(pollOptions == '')
			    {
			    	info = {
			            	 questionBody : question,
			            	 streamId : streamId,
							 questionAccess :questionAccess,
			             }
			    }
			    else
			    {
			    	info = {
			            	 questionBody : question,
			            	 streamId : streamId,
							 questionAccess :questionAccess,
							 pollsOptions: pollOptions
			             }
			    }
	       	 

				/* post profile page details */
		         $.ajax({
		             type: 'POST',
		             data: info,
		             url: BS.newQuestion,
		             cache: false,
		             dataType : "json",
		             success: function(data){
		            	 
		            		 console.log(data);
			            	 $('#Q-area').val("");
			            	 $('#pollArea').slideUp(700); 
			            	 $('#uploded-file').hide();
			            	 BS.options = 0;
			            	 
			            	 var owner = "";
	     					 if(data.question.userId.id == BS.loggedUserId)
	     					 {
			     				owner = "true";
	     					 }
	     					 else
	     					 {
			     				owner = "";
	     					 }
			     			
			            	 var source = $("#tpl-questions_with_polls").html();
			            	 var template = Handlebars.compile(source);
			            	 $('#all-questions').prepend(template({data:data,owner: owner}));
		             }
		         });
			}
	         
		},
		
		/**
         * NEW THEME -  get uploaded files 
         */
        getUploadedData: function(e){
        	
        	var self = this;;
    	    file = e.target.files[0];
    	    var reader = new FileReader();
    	    
    	   
    	      
        	/* capture the file informations */
            reader.onload = (function(f){
            	self.file = file;
            	
            	$('#uploded-file').html(f.name);
            	$('#uploded-file').show();
            	
            })(file);
            
            
             
            // read the  file as data URL
            reader.readAsDataURL(file);
          
        },
        
        
        /**
         * NEW THEME - Show comment text area on click
         */
        showCommentTextArea: function(eventName){
        	eventName.preventDefault();
        	var element = eventName.target.parentElement;
			var questionId =$(element).parents('div.follow-container').attr('id');
			
			// show / hide commet text area 
			if($('#'+questionId+'-addComments').is(":visible"))
			{
				
				$('#'+questionId+'-questionComment').val('');
				$('#'+questionId+'-addComments').slideToggle(300); 
				
				
			}
			else
			{
				$('#'+questionId+'-questionComment').val('');
				$('#'+questionId+'-addComments').slideToggle(200); 
				
			}
			
        },
        
        
        /**
		  * NEW THEME - Follow a question
		  */
        followQuestion: function(eventName){
			eventName.preventDefault();
			 
			var element = eventName.target.parentElement;
			var questionId =$(element).parents('div.follow-container').attr('id');
			
			var text = $('#'+eventName.target.id).text();
		
			var self =this;
			$.ajax({
				type: 'POST',
		        url:BS.followQuestion,
		        data:{
		        	questionId:questionId
		        },
		        dataType:"json",
		        success:function(data){
		        	
		        	//set display
		        	if(text == "Unfollow")
		    		{
		        		 $('#'+eventName.target.id).text("Follow");
		    		}
		        	else
		        	{
		        		$('#'+eventName.target.id).text("Unfollow");
		        	}
		        	 
	                /* Auto push */   
		        	var streamId =  $('.sortable li.active').attr('id');
 
	            }
	        });
	    },
	    
	    
	    /**
	     * NEW THEME - Rocking questions
	     */
	    rockQuestion: function(eventName){
	    	
	    	eventName.preventDefault();
			var element = eventName.target.parentElement;
			var questionId =$(element).parents('div.follow-container').attr('id');
			var self = this;
			
			$.ajax({
				type: 'POST',
	            url:BS.rockQuestion,
	            data:{
	            	questionId:questionId
	            },
	            dataType:"json",
	            success:function(data){
	            	 
	            	if($('#'+questionId+'-qstRockCount').hasClass('downrocks-message'))
	            	{
	            		$('#'+questionId+'-qstRockCount').removeClass('downrocks-message');
	            		$('#'+questionId+'-qstRockCount').addClass('uprocks-message');
	            	}
	            	else
	            	{
	            		$('#'+questionId+'-qstRockCount').removeClass('uprocks-message');
	            		$('#'+questionId+'-qstRockCount').addClass('downrocks-message');
	            	}
	            	
	            	// display the count in icon
	                $('#'+questionId+'-qstRockCount').find('span').html(data);
	                //auto push
	                var streamId =  $('.sortable li.active').attr('id');
					PUBNUB.publish({
						channel : "questionRock",
	                    message : { pagePushUid: self.pagePushUid ,streamId:streamId,data:data,questionId:questionId}
	                })
             	}
            });
        },
		
		/**
         * NEW THEME - select Private / Public ( social share ) options 
         */
        checkPrivateAccess: function (eventName) {
        	var streamName = $('.sortable li.active').text();
        	
        	if($('#private-to').attr('checked')!= 'checked')
        	{
        		$('#select-privateTo').text("Public");
            	
        	}
        	else
        	{
        		$('#select-privateTo').text(streamName);
        		$('#share-discussions li.active').removeClass('active');
        	}
        		
        },
        
        /**
         * NEW THEME - select private to class options
         */
        selectPrivateToList: function(eventName){
        	
        	eventName.preventDefault();
        	$('#select-privateTo').text($(eventName.target).text());
        	
        	//uncheck private check box when select Public
        	if($(eventName.target).text() == "Public")
        	{
        		$('#private-to').attr('checked',false);
        	}
        	else
        	{
        		$('#private-to').attr('checked',true);
        		$('#share-discussions li.active').removeClass('active');
        	}
        		
        },
        
        
        /**
	     * NEW THEME - get all questions of a stream
	     */
	    getAllQuestions :function(streamid,pageNo,limit){
	    	
	         var self = this;
	         
	         /* get all messages of a stream  */
			 $.ajax({
					type : 'POST',
					url : BS.getAllQuestionsOfAStream,
					data :{
						streamId :streamid,
						pageNo : pageNo,
						limit : limit
					},
					dataType : "json",
					success : function(data) {
						self.displayQuestions(data);
					}
			 });
	    	
	    },
	    
	    
	    /**
         * NEW THEME - Display messages 
         */
	    displayQuestions: function(data){
        	
//        	var pattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;
//        	var trueurl='';
        	var self = this;
        	
			//hide page loader image
			if(!data.length)
				$('.page-loader').hide();
				   
			//display the messages
			_.each(data, function(data) {
				 
				var owner = "";
				if(data.userId.id == BS.loggedUserId)
				{
					owner = "true";
				}
				else
				{
					owner = "";
				}
				var questionType ='';
				var questionBody = data.questionBody;
                                                
				//var links =  msgBody.match(BS.urlRegex); 
                var qstUrl=  questionBody.replace(BS.urlRegex1, function(qstUrlw) {
                	trueurl= qstUrlw;    
                    return qstUrl;
                });
                
                //to get the extension of the uploaded file
                var extension = (trueurl).match(pattern);  
                
               
                if(data.questionType.name == "Text")
                {    
                    	 
                     //to check whether the url is a google doc url or not
                     if(questionBody.match(/^(https:\/\/docs.google.com\/)/)) 
                     {
                    	 questionType = "googleDocs";
                     }
                     else
                     {
                    	 questionType = "messageOnly";
                         var linkTag =  questionBody.replace(BS.urlRegex1, function(url) {
                               return '<a target="_blank" href="' + url + '">' + url + '</a>';
                         });
                     }
                }
                else
                {          
                     // set first letter of extension in capital letter  
                	  if(extension)
                	  {
                		  extension = extension[1].toLowerCase().replace(/\b[a-z]/g, function(letter) {
                			  return letter.toUpperCase();
  	                	  }); 
                	  }
                }
                
                var datVal =  formatDateVal(data.timeCreated);
                
				var datas = {
					 	 "datas" : data,
					 	 "datVal":datVal,
					 	 "owner" :owner
				    }
               
                
					
				if(questionType == "googleDocs")
				{
					var datas = {
					    "datas" : data,
	                    "datVal" :datVal,
	                    "previewImage" : "images/google_docs_image.png",
	                    "type" : "googleDoc",
	                    "owner" :owner
					}	
					var source = $("#tpl-questions_with_polls").html();
						
				}
				else if(questionType == "messageOnly")
				{
					
					var source = $("#tpl-questions_with_polls").html();
						
				}
				else
				{
					if(data.questionType.name == "Image")
					{
						var source = $("#tpl-questions_with_polls").html();
  						
					}
					else if(data.questionType.name == "Video")
					{
						var source = $("#tpl-questions_with_polls").html();
  						
					}
					else
					{
						var previewImage = '';
						var commenImage ="";
						var type = "";
						 
						if(extension == 'Ppt')
						{
                            previewImage= "images/presentations_image.png";
                            type = "ppt";
                            
						}
						else if(extension == 'Doc')
						{
							previewImage= "images/docs_image.png";
							type = "doc";
							 	
						}
						else if(extension == 'Pdf')
						{
							 
							previewImage= data.anyPreviewImageUrl;
							type = "pdf";
						}
						else
						{
							previewImage= "images/textimage.png";
							commenImage = "true";
							type = "doc";
							
						}
						
						var datas = {
							    "datas" : data,
                                "datVal" :datVal,
                                "previewImage" :previewImage,
                                "extension" : extension,
                                "commenImage" : commenImage,
                                "type" : type,
                                "owner" :owner
				        }	
					
					    var source = $("#tpl-questions_with_polls").html();
						
				  }
						
				}
				
				var template = Handlebars.compile(source);
					$('#all-questions').append(template(datas));
					$('.drag-rectangle').tooltip();		
					/* check whether the user is follwer of a message or not */
			         $.ajax({
			    			type : 'POST',
			    			url : BS.isAFollower,
			    			data : {
			    				 questionId : data.id.id
			    			},
			    			dataType : "json",
			    			success : function(status) {
			    				 if(status == "true")
			    					 $('#'+data.id.id+'-follow').text("Unfollow");
			    			}
			    	 });
			         
			         
			         /* make a call to check whether the logged user is already rock this message*/ 
					 $.ajax({
			             type: 'POST',
			             url:BS.isARockerOfQuestion,
			             data:{
			            	 questionId:data.id.id
			             },
			             dataType:"json",
			             success:function(result){
			            	 if(result == "true")
			            	 {
			            		 $('#'+data.id.id+'-qstRockCount').removeClass('uprocks-message');
			            		 $('#'+data.id.id+'-qstRockCount').addClass('downrocks-message');
			            		            		 
			            	 }
			            	 else
			            	 {
			            		 $('#'+data.id.id+'-qstRockCount').removeClass('downrocks-message');
			            		 $('#'+data.id.id+'-qstRockCount').addClass('uprocks-message');			 
			            	 }
			            	 
			             }
			          });
						 
					 /* get profile images for messages */
			         $.ajax({
			    			type : 'POST',
			    			url : BS.profileImage,
			    			data : {
			    				 userId :  data.userId.id
			    			},
			    			dataType : "json",
			    			success : function(pofiledata) {
			    				var imgUrl;
			    				if(pofiledata.status)
			    				 {
			    					imgUrl = "images/profile-img.png";
			    				 }
			    				 else
			    				 {   
			    					 // shoe primary profile image 
			    					 if(pofiledata.contentType.name == "Image")
			    					 {
			    						imgUrl = pofiledata.mediaUrl;
			    					 }
			    					 // shoe primary profile video 
			    					 else
			    					 {
			    						imgUrl = pofiledata.frameURL;
			    					 }
			    				 }
			    				$('img#'+data.id.id+'-img').attr("src", imgUrl);
			    			}
			    	 });
				           
					 if(linkTag)
						 $('p#'+data.id.id+'-id').html(linkTag);
						 
                 var url=data.questionBody;
                 if(data.questionType.name == "Text"){   
                                     
                     if(!url.match(/^(https:\/\/docs.google.com\/)/)) {
                         // embedly
                         $('p#'+data.id.id+'-id').embedly({
                                 maxWidth: 200,
                                 msg : 'https://assets0.assembla.com/images/assembla-logo-home.png?1352833813',
	                             wmode: 'transparent',
	                             method: 'after',
	                             key:'4d205b6a796b11e1871a4040d3dc5c07'
                         });
                      }

                 }
                 else       
                 {
                    	 
                    	 if(data.questionType.name == "Image")
                    	 {
                    		   
//                    		 var content = '<div  class="gallery clearfix " style="clear: none !important;"></div><div class="gallery clearfix hrtxt"><a rel="prettyPhoto"  id="'+data.id.id+'"  href="' + msgUrl + '"><img class="previw-pdf" id="'+data.id.id+'" src="'+data.anyPreviewImageUrl+'" height="50" width="150" /></a></div>'


                    	 }
                    	 else if(data.questionType.name == "Video")
                    	 {
//                    		 var content = '<div  class="gallery clearfix " style="clear: none !important;"></div><div class="gallery clearfix hrtxt"><a rel="prettyPhoto" id="'+data.id.id+'"  href="' + msgUrl + '"><img class="previw-pdf" id="'+data.id.id+'" src="'+data.anyPreviewImageUrl+'" height="50" width="150" /></a></div>';
                    	 }
                    	 else
                    	 {
                    	 }
                    	 
//                         $('input#'+data.id.id+'-url').val(msgUrl); 
                    	 
                    	 /* for video popups */
                         $("area[rel^='prettyPhoto']").prettyPhoto();
      					 $(".gallery:first a[rel^='prettyPhoto']").prettyPhoto({animation_speed:'normal',theme:'light_square',slideshow:3000, autoplay_slideshow: true});
      					 $(".gallery:gt(0) a[rel^='prettyPhoto']").prettyPhoto({animation_speed:'fast',slideshow:10000, hideflash: true});
      			
                   }
                   
						 
				   self.showAllComments(data.id.id);
		      });
		
        },
        
        
        /**
		  * NEW THEME - show question rockers list 
		  */
		showRockersList: function(eventName){
			 
			eventName.preventDefault();
	        	
	       	var element = eventName.target.parentElement;
	       	var parentUl = $(eventName.target).parent('ul');
			$(parentUl).find('a.active').removeClass('active');
			
			var questionId =$(element).parents('div.follow-container').attr('id');
		    if($('#'+questionId+'-questionRockers').is(':visible'))
		    {
		    	 
		    	$('#'+questionId+'-questionRockers').slideUp(600); 
		    	$(eventName.target).removeClass('active');
		    }
		    else
		    {
		    	$.ajax({
		    		type: 'POST',
		    		url:BS.giveMeRockersOfQuestion,
		    		data:{
		    			questionId:questionId
		    		},
		    		dataType:"json",
		    		success:function(data){
//		    			$('#'+questionId+'-questionRockers').html("");
//		    			// prepair rockers list
//		    			_.each(data, function(rocker) {
//					 
////		    				var questionRockers = $("#tpl-message-rockers").html();
////		    				var questionRockersTemplate = Handlebars.compile(questionRockers);
////		    				$('#'+questionId+'-questionRockers').append(questionRockersTemplate({rocker:rocker}));
//		    			});
//		    			
//		    			$(eventName.target).addClass('active');
//           	 
//		            	$('#'+questionId+'-allComments').slideUp();
//		            	$('#'+questionId+'-newCommentList').slideUp();
//           	
//		            	$('#'+questionId+'-msgRockers').slideDown(600); 

 
	             	}
	            });
		    }
				
		},
        
        /**
	     * NEW THEME - fetch and show all comments of a question
	     */
	    showAllComments: function(questionId){
	    	
	    	var count = 0;
			var parentQst = questionId;

			$.ajax({
				type: 'POST',
	            url: BS.allCommentsForAQuestion,
	            data:{
	            	questionId:parentQst
	            },
	            dataType:"json",
	            success:function(datas){
	            	 
	            	var cmtCount  = datas.length;
	            	 
	            	_.each(datas, function(data) {
	            		 
		  			    var comments = $("#tpl-question-comment").html();
					    var commentsTemplate = Handlebars.compile(comments);
					    $('#'+parentQst+'-allComments').prepend(commentsTemplate(data));
							 
					    /* get profile images for comments */
				        $.ajax({
				        	type : 'POST',
			    			url : BS.profileImage,
			    			data : {
			    				 userId :  data.userId.id
			    			},
			    			dataType : "json",
			    			success : function(pofiledata) {
			    				var imgUrl;
			    				if(pofiledata.status)
			    				{
			    					imgUrl = "images/profile-img.png";
			    				}
			    			    else
		    				    {   
			    			    	// shoe primary profile image 
		    					    if(pofiledata.contentType.name == "Image")
		    					    {
		    					    	imgUrl = pofiledata.mediaUrl;
		    					    }
			    					// shoe primary profile video 
			    					else
			    					{
			    						imgUrl = pofiledata.frameURL;
			    					}
	  				    		}
			    				$('#'+data.id.id+'-image').attr("src" ,imgUrl); 
			    			}
				        });
							  
	            	});
	        	    if(cmtCount)
	                {
	        	    	$('#'+parentQst+'-totalComment').html(cmtCount);
	        	    	$('#'+parentQst+'-allComments').hide();

	                }
	            }
			});
	    },
        
        /**
         * NEW THEME - actvate share icon on selection
         */
        actvateShareIcon: function(eventName){
        	
        	eventName.preventDefault();
        	$('#private-to').attr('checked',false);
        	$('#select-privateTo').text("Public");
        	if($(eventName.target).parents('li').hasClass('active'))
        	{
        		$(eventName.target).parents('li').removeClass('active');
        	}
        	else
        	{
        		$(eventName.target).parents('li').addClass('active');
        	}
        	
        },
        
        /**
	     * NEW THEME - Functio for follow user
	     */
	    followUser: function(eventName){
	    	
	    	eventName.preventDefault();
	    	var userId = eventName.target.id;
	    	
	    	var text = $(eventName.target).text();
	    	
	    	
	    	$.ajax({
 				type: 'POST',
 		        url:BS.followUser,
 		        data:{
 		        	userId:userId
 		        },
 		        dataType:"json",
 		        success:function(data){
 		        	 
 		        	//set display
 		        	if(text == "Unfollow")
 		    		{
 		        		$('a.follow-user').each(function() {
 		        			 
 		        			if($(this).attr('id') == userId)
 		        			{
 		        				$(this).text("Follow");
 		        			}
 		        			
 		        		});
 		        		
 		    		}
 		        	else
 		        	{
 		        		$('a.follow-user').each(function() {
		        			 
 		        			if($(this).attr('id') == userId)
 		        			{
 		        				$(this).text("Unfollow");
 		        			}
 		        			
 		        		});
 		        	}
 		        	 
 
	            }
	        });
	    	
	    },

        /**
         * NEW THEME -show  Upload files option when we select category
         */
   		 uploadFiles: function(eventName){
   			 eventName.preventDefault();
   			 $('#upload-files-area').click();
   		 },
   	 
		/**
		 * click to view areas for adding poll options
		 */
		addPollOptionsArea: function(eventName){
			eventName.preventDefault();
			BS.options = 2;
			$('#pollArea').slideToggle(700); 
		},
		
		/**
		 * function  to add more poll options
		 */
		addMorePollOptions : function(eventName){
			
			eventName.preventDefault();
			BS.options++;
			if(BS.options == 3)
				var options ='<li><input type="text"   id="option'+BS.options+'" placeholder="Add 3rd Poll Option" name="Add Option"> </li>';
			else
				var options ='<li><input type="text"   id="option'+BS.options+'" placeholder="Add '+BS.options+'th Poll Option" name="Add Option"> </li>';

			var parent = $('#add_more_options').parents('li');
			$('.answer li').last().after(options);
		 },
			
		/**
         *  NEW THEME - Sort questions
         */
		sortQuestions: function(eventName){
        	
        	eventName.preventDefault();
        	var self = this;
        	var streamId = $('.sortable li.active').attr('id');
        	$('#sortBy-select').text($(eventName.target).text());

        },
        
        /**
         * NEW THEME - sort questions within a period 
         */
        sortQuestionsWithinAPeriod: function(eventName){
        	eventName.preventDefault();
        	$('#date-sort-select').text($(eventName.target).text());
        },
	 
	  
	});
