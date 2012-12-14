/***
	 * BeamStream
	 *
	 * Author                : Cuckoo Anna (cuckoo@toobler.com)
	 * Company               : Toobler
	 * Email:                : info@toobler.com
	 * Web site              : http://www.toobler.com
	 * Created               : 20/September/2012
	 * Description           : Backbone view for main stream page
	 * ==============================================================================================
	 * Change History:
	 * ----------------------------------------------------------------------------------------------
	 * Sl.No.  Date   Author   Description
	 * ----------------------------------------------------------------------------------------------
	 *
	 * 
     */
    
BS.FilesMediaView = Backbone.View.extend({
                
        events: {
                //         "click a#file-type" : "showFilesTypes",
                //         "click ul.file-type li a" : "hideList",
                //         "click '.nav a" : "addActive",
                 //        "click #gdoc_uploadbutton" : "uploadFile",
                         "click .doctitle" : "editDocTitle",
                         "click .imgtitle" : "editImgTitle",
                         "click .videotitle" : "editVideoTitle",  
                //         "click .audiotitle" : "editAudioTitle",
                         "click .pdftitle" : "editPdfTitle",
                         "click .presentationtitle" : "editPresentationTitle",
                        "mouseenter #uploadmedia_dr":"uploadMediadwn",
                        "mouseleave #dropdownnew":"uploadMediaup",
                        "click #links_dr":"linksMenuList",
                        "click #links_uploadbutton":"linkupload",
                        "click #docs_dr":"docsMenuList",  
                        "click #googledocs_mycomp":"showFileForm",
                        "click #googledocs_dr":"googleDocs",
                        "click #importfrmlink_dr": "importFromLink",                
                        "click #video_dr":"videoMenuList",
                        "click #youtube_dr":"youtubeMenu",
                        "click #video_uploadbutton":"videoUpload",
                        "click #audio_dr":"audioMenuList",               
                        "click #vialink_dr":"audioVialink",
                        "click #audio_uploadbutton":"audioUpload",
                        "click #presentations_dr":"presentationMenuList",
                        "click #presvialink_dr":"presentationVialink",
                        "click #press_uploadbutton":"presentationUpload",
                        "click #docfrmcomputer_uploadbutton": "saveMyFile",
                        'change #doc-from-computer' :'displayImage',
                        'click #docfrmcomputer_closePopup': "hidePopUpBlock",
              
 //                       "click #select_dr":"selectboxdwn",
 //                       "blur #select_dr":"selectboxup"
 //                       "click #profile-images":"listProfileImages",
//                        "click .google_doc" : "showDocPopup",
                       
        	 "click .then-by li a" : "filterDocs",
        	 "click #view-by-list" : "selectViewByAll",
        	 "click #view-files-byrock-list" : "selectViewByRock",
        	 "click .rock-medias" : "rocksMeidas",
        	 "click .rock_docs" : "rocksDocuments",
        	 "click #by-class-list li" :"sortByClass",
        	 "click #category-list li" :"sortBycategory",
        	 "click .browse-right a" :"selectViewStyle",
        	 "click #view-by-date-list" : "selectViewByDate",
        	 
            		
            },
	
            initialize:function () {         	 	            
                this.source = $("#tpl-files-media").html();
                this.template = Handlebars.compile(this.source);
                this.pictres();	
                this.videos();   
                this.docsList();
                this.docFromComputer();
     //           this.audio();  
//                this.spreadsheet();  
                this.presentation();  
                this.pdffiles();
                this.docFromComputer();
//                this.links(); 
     //           this.template= _.template($("#tpl-files-media").html()); 
    },

    
            render:function (eventName) {
                $(this.el).html(this.template);
                return this;
                },
    
                
                /**
                 * NEW THEME - view files 
                 */
                selectViewByAll: function(eventName){
                	eventName.preventDefault();
                	$('#view-by-select').text($(eventName.target).text());
                },
                
                /**
                 * NEW THEME - view files by date 
                 */
                selectViewByDate: function(eventName){
                	eventName.preventDefault();
                	$('#view-by-date-select').text($(eventName.target).text());
                },
                
                /**
                 * NEW THEME - view files 
                 */
                selectViewByRock: function(eventName){
                	eventName.preventDefault();
                	$('#view-files-byrock-select').text($(eventName.target).text());
                },
                
                /**
                 * NEW THEME - rocks media( images/videos) 
                 */
                rocksMeidas: function(eventName){
                	eventName.preventDefault();
                	var element = eventName.target.parentElement;
                	var imageId =$(element).attr('id');
                	var parent = $('div#'+imageId).parent('li');
                
                	// post documentId and get Rockcount 
                	$.ajax({
                		type: 'POST',
                		url:BS.rockTheUsermedia,
                		data:{
                			userMediaId:imageId
                		},
                		dataType:"json",
                		success:function(data){	              	 
                			// display the rocks count  
                			$('#'+imageId+'-activities li a.hand-icon').html(data);	   
                			$(parent).attr('data-rock',data);
                  
                		}
                	});
                },
                
                /**
                 * NEW THEME - select files view style
                 */
                selectViewStyle: function(eventName){
                	eventName.preventDefault();
                	$('.browse-right a.activebtn').removeClass('activebtn');
                	$(eventName.target).parents('a').addClass('activebtn');
                },
                
                /**
                 * NEW THEME - sort files by class/School
                 */
                sortByClass: function(eventName){
                	
                	eventName.preventDefault();
                	$('#by-class-select').text("by "+$(eventName.target).text());

                },
                
                /**
                 * NEW THEME - sort files by category
                 */
                sortBycategory: function(eventName){
                	eventName.preventDefault();
                	$('#category-list-select').text($(eventName.target).text());
                },
                
                /**
                 * NEW THEME - rocks other documents 
                 */
                rocksDocuments: function(eventName){
                	
                	eventName.preventDefault();
                    var element = eventName.target.parentElement;
                    var docId =$(element).attr('id');
                    // post documentId and get Rockcount 
                    $.ajax({
                    	type: 'POST',
                    	url:BS.rockDocs,
                    	data:{
                    		documentId:docId
                    	},
                    	dataType:"json",
                    	success:function(data){	              	 
                    		// display the rocks count  
                    		$('#'+docId+'-activities li a.hand-icon').html(data);	   
                    	}
                    });
                },
                
                
            /**
            * show file types
            */
            showFilesTypes :function(eventName){ 	
                eventName.preventDefault();
                $('.file-type').slideDown();	
                },
    
            /**
             * hide file types
             */
            hideList : function(eventName){
                eventName.preventDefault();
                $('.file-type').slideUp();
                },
            //TODO
            addActive : function(eventName){
                var id = eventName.target;
                var $this = $(id);
                if (!$this.is('.dropdown-toggle')) {
                    $this
                    .closest('ul')
                    .find('li').removeClass('active').end()
                    .end()
                    .closest('li').addClass('active');
                    }
                },
         
            /*
              * Author:Cuckoo Anna on 09July2012
              * For Uploading docs
              * docType can be one of "GoogleDocs", "YoutubeVideo", "Other".
              * docAccess can be one of "Private", "Public", "Restricted", "Stream".
            */  
            uploadFile : function()
            {
                /* post the documents details */
                var documentModel = new BS.Document();
                if($("#gdoc-url").val().length != 0){
                    documentModel.set({
                    docName : $("#gdoc-name").val(),
                    docURL : $("#gdoc-url").val(),  
                    docAccess: 'Public',
                    docType: 'GoogleDocs',
                    streamId: $("#doc-class-list").val(),
                    docDescription: $("#gdoc-description").val()
                    });
                var documentData = JSON.stringify(documentModel);
                var self = this;
                    $.ajax({
                    type : 'POST',
                    url : BS.docUpload,
                    data : {
                        data : documentData
                        },
                    dataType : "json",
                    success : function(data) {
                        if(data.status == 'Failure')
                            alert("Failed.Please try again");
                        else
                            {
                            alert("Doc Uploaded Successfully");
                                self.docsList(); 
                                console.log("Doc Uploaded Successfully");
                            }
                        }           
                    });
                    }
                $("#dropdownnew").find('ul').hide(250); 
                },
      
                /**
                 * NEW THEM - filter docs.. and prevent default action
                 */
                filterDocs :function (eventName){
                	 eventName.preventDefault();
                },
            /**
            * NEW THEME-Display the google doc
            */    
            docsList : function(){  
                var i = 1;
                var self = this;
                BS.user.fetch({ success:function(e) {
                /* get profile images for user */
                $.ajax({
                    type : 'GET',
                    url :  BS.getAllDocs,
                    dataType : "json",
                    success : function(docs) {
                        if(docs.length != 0)  {
                            _.each(docs, function(doc) {
                            var datVal =  self.formatDateVal(doc.creationDate);                   
                            content= '<div class="image-wrapper hovereffect" id="'+doc.id.id+'">'
                                +' <div class="hover-div"><img class="cover-picture" src="images/google_docs_image.png ">'
                                +'<div class="hover-text">'               
                                +'<div class="comment-wrapper">'                                
                                +'<a href="#googledocs" style="text-decoration: none">'
                                +' <div id="media-'+doc.id.id+'" >'
                                +' <h4 id="name-'+doc.id.id+'">'+doc.documentName+'</h4>'                                
                                +'<div class="description-info"><div class="description-left"><p id="description-'+doc.id.id+'" class="doc-description">'+doc.documentDescription+'</p></div></a>'
                                +' <div id="'+doc.id.id+'" class="comment-wrapper2">'
                                +'<a href="#" class="tag-icon" data-original-title="Search by Users"></a>   <a href="#" class="hand-icon rock_docs"></a>'
                                +'<a href="#" class="message-icon"></a>    <a href="#" class="share-icon"></a>'
                                +'</div></div></div>'
                                +'<h5 class="doctitle" id="'+doc.id.id+'"><span><img src="images/title-plus.png"></span> Title & Description</h5>'          
                                +'<div class="dateinfo"><span class="state">State</span><span class="date">'+datVal+'</span></div>'
                                +'</div></div></div>'
                                +'<div class="comment-wrapper1"> <a class="common-icon data" href="#"></a>'
                                +'<ul id="'+doc.id.id+'-activities" class="comment-list">'
                                +'<li><a class="eye-icon" href="#">0</a></li>'
                                +'<li><a class="hand-icon" href="#">'+doc.documentRocks+'</a></li>'
                                +'<li><a class="message-icon" href="#">0</a></li>'
                                +'</ul>'
                                +'</div>';
                            $('#coverdocs').html(content);                     
                            });
                        }
                        }
                    });
                }});
                },

            /**
            * NEW THEME-Display the doc files uploaded from computer
            */       
            docFromComputer :function(){
                var extensionpattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;
                var self = this;
                $.ajax({
                type : 'GET',
                url :  BS.getAllDOCSFilesForAUser,
                dataType : "json",
                success : function(docs) {
                    if(docs.length != 0)  {
                    _.each(docs, function(doc) {  
                        var extension = (doc.documentURL).match(extensionpattern); 
                                        // set first letter of extension in capital letter  
                        extension = extension[1].toLowerCase().replace(/\b[a-z]/g, function(letter) {
                            return letter.toUpperCase();
                            });
                    var datVal =  self.formatDateVal(doc.creationDate);                      
                    var content= '<div class="image-wrapper hovereffect" id="'+doc.id.id+'">'
                        +' <div class="hover-div"><img class="cover-picture" src="images/textimage.png"><h3 class="common-doctext" >'+extension+'</h3>'
                        +'<div class="hover-text">'               
                        +'<div class="comment-wrapper">'                                
                        +'<a href="#docs" style="text-decoration: none">'
                        +' <div id="media-'+doc.id.id+'" >'
                        +' <h4 id="name-'+doc.id.id+'">'+doc.documentName+'</h4>'                                
                        +'<div class="description-info"><div class="description-left"><p class="doc-description" id="description-'+doc.id.id+'">'+doc.documentDescription+'</p></div></a>'
                        +' <div id="'+doc.id.id+'" class="comment-wrapper2">'
                        +'<a href="#" class="tag-icon" data-original-title="Search by Users"></a>   <a href="#" class="hand-icon rock_docs"></a>'
                        +'<a href="#" class="message-icon"></a>    <a href="#" class="share-icon"></a>'
                        +'</div></div></div>'
                        +'<h5 class="doctitle" id="'+doc.id.id+'"><span><img src="images/title-plus.png"></span> Title & Description</h5>'          
                        +'<div class="dateinfo"><span class="state">State</span><span class="date">'+datVal+'</span></div>'
                        +'</div></div></div>'
                        +'<div class="comment-wrapper1"> <a class="common-icon data" href="#"></a>'
                        +'<ul id="'+doc.id.id+'-activities" class="comment-list">'
                        +'<li><a class="eye-icon" href="#">0</a></li>'
                        +'<li><a class="hand-icon" href="#">'+doc.documentRocks+'</a></li>'
                        +'<li><a class="message-icon" href="#">0</a></li>'
                        +'</ul>'
                        +'</div>';                
                        $('#coverdoc_com').html(content);   
                        });
                    }
                    }
                });
                },
        
         /*
         *Edit the document title 
         */
            editDocTitle :function(eventName){        	
                var docId = eventName.currentTarget.id;             
                var docUrl = $('input#id-'+docId).val(); 
                $.ajax({
                    type : 'POST',
                    url :  BS.getOneDocs,
                    data : {
                        documentId: docId  
                        },
                    dataType : "json",
                    success : function(docs) {           
	                var datas = {
                            "id" : docId,
                            "url" : docUrl,
                            "type" : 'Docs',
                            "title" : docs[0].documentName,
                            "description" :docs[0].documentDescription
                            }
                        BS.mediaeditview = new  BS.MediaEditView();
                        BS.mediaeditview.render(datas);
                        $('#edit-popup').html(BS.mediaeditview.el);  
                        $('#edit-bootstrap_popup').modal('show');
                        }
                    });          
                },
        
            /*
            *function to show pictures in filesmediaview
            */
            pictres : function()
            {  
            var self = this;
            var arraypictures = new Array();
            var content='';
            var coverpicture;           
            BS.user.fetch({ success:function(e) {
                /* get images for user */
                $.ajax({
                    type : 'GET',
                    url :  BS.allProfileImages,
                        data : {
                                'userId': e.attributes.id.id
                        },
                        dataType : "json",
                        success : function(images) {
                            if(images.length != 0)
                            {
                            	
//                            	content='<li  data-groups="["recent"]" id="coverimage" data-date-created="11/06/2012" class="item" >'
//                            			+'<div class="image-wrapper"><div class="hover-div">'
//                            			+'<div id="profile-images"><img class="cover-picture" src="images/pictures_image.png">'
//                            			+'</div><div class="hover-text"><p class="emptyfiles"> No Uploaded Images </p>'
//                            			+'</div></div></div>'
//                            			+'<div class="comment-wrapper1"> <a class="common-icon camera" href="#"></a>'
//                            			+'<ul class="comment-list">'
//                            			+'<li><a class="eye-icon" href="#">87</a></li>'
//                            			+'<li><a class="hand-icon" href="#">5</a></li>'
//                            			+'<li><a class="message-icon" href="#">10</a></li>'
//                            			+'</ul>'
//                            			+'</div>'
//                            			+'</li>';
//                            	 $('#grid').append
                            	
                             _.each(images, function(image) {
                            	 
                            var datVal =  self.formatDateVal(image.dateCreated);  
                            content= '<div class="image-wrapper hovereffect" id="'+image.id.id+'">'
                                +' <div class="hover-div"><img class="filmedia-picture" src="'+image.mediaUrl+'">'
                                +'<div class="hover-text">'               
                                +'<div class="comment-wrapper">'                                
                                +'<a href="#imagelist" style="text-decoration: none">'
                                +' <div id="media-'+image.id.id+'" >'
                                +' <h4 id="name-'+image.id.id+'">'+image.name+'</h4>'                                
                                +'<div class="description-info"><div class="description-left"><p class="doc-description" id="description-'+image.id.id+'" >'+image.description+'</p></div></a>'
                                +' <div id="'+image.id.id+'" class="comment-wrapper2">'
                                +'<a href="#" class="tag-icon" data-original-title="Search by Users"></a>   <a href="#" class="hand-icon rock-medias"></a>'
                                +'<a href="#" class="message-icon"></a>    <a href="#" class="share-icon"></a>'
                                +'</div></div></div>'
                                +'<h5 class="imgtitle" id="'+image.id.id+'"><span><img src="images/title-plus.png"></span> Title & Description</h5>'          
                                +'<div class="dateinfo"><span class="state">State</span><span class="date">'+datVal+'</span></div>'
                                +'</div></div></div>'
                                +'<div class="comment-wrapper1"> <a class="common-icon camera" href="#"></a>'
                                +'<ul id="'+image.id.id+'-activities"  class="comment-list">'
                                +'<li><a class="eye-icon" href="#">0</a></li>'
                                +'<li><a class="hand-icon" href="#">'+image.rocks+'</a></li>'
                                +'<li><a class="message-icon" href="#">0</a></li>'
                                +'</ul>'
                                +'</div>'; 
                            $('#coverimage').html(content);  
                              });
                            }
                        }
               });

            }});

        },
        
        /*
         * Edit the Image's  title and Description
        */ 
         editImgTitle :function(eventName){ 
        	 
        	var imageId = eventName.currentTarget.id;      
        	
           /* post new title and description */
           $.ajax({                                       
                type : 'POST',
                url :  BS.getMedia,
                data : {
                	userMediaId: imageId  
                },
                dataType : "json",
                success : function(imagess) {   
                	
                    var imagedatas = {
                		   "id" : imagess[0].id.id,
                		   "url" : imagess[0].mediaUrl,
                		   "type" : 'UserMedia',
                		   "title" : imagess[0].name,
                		   "description" : imagess[0].description
                    }    
		            BS.mediaeditview = new  BS.MediaEditView();
		            BS.mediaeditview.render(imagedatas);
		            $('#edit-popup').html(BS.mediaeditview.el);
		            $('#edit-bootstrap_popup').modal('show');
               }
           });
            
        },
        
        /*
         *function to show pictures in filesmediaview
         */
        videos:function(){
            var self = this;
            var arrayvideos = new Array();
            var content='';
            var coverpicture; 
            BS.user.fetch({ success:function(e) {
              /* get videos for user */
              $.ajax({
                        type : 'GET',
                        url : BS.allProfileVideos,
                        dataType : "json",

                        success : function(videos) { 
                        	
                            if(videos.length != 0)
                            {
                                arraypictures=videos;
                                coverpicture=arraypictures[arraypictures.length-1];
                                  _.each(videos, function(video) {
                                	  var datVal =  self.formatDateVal(video.dateCreated);   
                                content= '<div class="image-wrapper hovereffect">'
                                        +' <div class="hover-div"><img class="filmedia-picture" src="'+coverpicture.frameURL+'">'
                                        +'<div class="hover-text">'               
                                        +'<div class="comment-wrapper">'                                
                                        +'<a href="#videos" style="text-decoration: none">'
                                        +' <div id="media-'+video.id.id+'" >'
                                        +' <h4 id="name-'+video.id.id+'">'+video.name+'</h4>'                                
	                                +'<div class="description-info"><div class="description-left"><p id="description-'+video.id.id+'" class="doc-description">'+video.description+'</p></div></a>'
                                        +' <div id="'+video.id.id+'" class="comment-wrapper2">'
                                        +'<a href="#" class="tag-icon" data-original-title="Search by Users"></a>   <a href="#" class="hand-icon rock-medias"></a>'
	                                +'<a href="#" class="message-icon"></a>    <a href="#" class="share-icon"></a>'
                                        +'</div></div></div>'
	                                +'<h5 class="videotitle" id="'+video.id.id+'"><span><img src="images/title-plus.png"></span> Title & Description</h5>'          
	                                +'<div class="dateinfo"><span class="state">State</span><span class="date">'+datVal+'</span></div>'
	                                +'</div></div></div>'
	                                +'<div class="comment-wrapper1"> <a class="common-icon video" href="#"></a>'
	                                +'<ul id="'+video.id.id+'-activities" class="comment-list">'
	                                +'<li><a class="eye-icon" href="#">0</a></li>'
	                                +'<li><a class="hand-icon" href="#">'+video.rocks+'</a></li>'
	                                +'<li><a class="message-icon" href="#">0</a></li>'
	                                +'</ul>'
	                                +'</div>';
                                 $('#covervideo').html(content);  
                                  });
                            }
                        }
               });

            }});
        },
        
        /*
        * Edit the Video title and decsription
        */  
        editVideoTitle :function(eventName){  
            
	           var videoId = eventName.currentTarget.id;            
	           $.ajax({                                       
	                type : 'POST',
	                url :  BS.getMedia,
	                data : {
	                	userMediaId: videoId  
	                },
	                dataType : "json",
	                success : function(imagess) {                          
	                     var imagedatas = {
		                     "id" : imagess[0].id.id,
		                     "url" : imagess[0].mediaUrl,
		                     "type" : 'UserMedia',
		                     "title" : imagess[0].name,
		                     "description" : imagess[0].description
	                     }
			            BS.mediaeditview = new  BS.MediaEditView();
			            BS.mediaeditview.render(imagedatas);
			            $('#edit-popup').html(BS.mediaeditview.el);
			            $('#edit-bootstrap_popup').modal('show');
	                }
	           });
          },
        
        /**
         * Function for show audio
         */
        audio :function(eventName){
//            $('.coveraud').html('content');
            var self = this;
            $.ajax({
                        type : 'GET',
                        url :  BS.getaudioFilesOfAUser,
                        dataType : "json",
                        success : function(data) {
//                            if(docs.length != 0)  {
                              _.each(data, function(audio) {
                               var datVal =  self.formatDateVal(audio.creationDate);     
                           var content= '<div class="image-wrapper hovereffect">'
                                        +' <div class="hover-div"><img class="cover-picture" src="images/audio_image.png">'
                                        +'<div class="hover-text">'               
                                        +'<div class="comment-wrapper">'                                
                                        +'<a href="#audioview" style="text-decoration: none">'
                                        +' <div id="media-'+audio.id.id+'" >'
                                        +' <h4 id="name-'+audio.id.id+'">'+audio.documentName+'</h4>'                                
	                                +'<div class="description-info"><div class="description-left"><p id="description-'+audio.id.id+'" class="doc-description">'+audio.documentDescription+'</p></div></a>'
                                        +' <div class="comment-wrapper2">'
                                        +'<a href="#" class="tag-icon" data-original-title="Search by Users"></a>   <a href="#" class="hand-icon"></a>'
	                                +'<a href="#" class="message-icon"></a>    <a href="#" class="share-icon"></a>'
                                        +'</div></div></div>'
	                                +'<h5 class="audiotitle" id="'+audio.id.id+'"><span><img src="images/title-plus.png"></span> Title & Description</h5>'          
	                                +'<div class="dateinfo"><span class="state">State</span><span class="date">'+datVal+'</span></div>'
	                                +'</div></div></div>'
	                                +'<div class="comment-wrapper1"> <a class="common-icon music" href="#"></a>'
	                                +'<ul class="comment-list">'
	                                +'<li><a class="eye-icon" href="#">87</a></li>'
	                                +'<li><a class="hand-icon" href="#">5</a></li>'
	                                +'<li><a class="message-icon" href="#">10</a></li>'
	                                +'</ul>'
	                                +'</div>';
                               $('#coveraudio').html(content); 
                               
                              });
//                        }
                        }
               });
            
                                 
        },
        
        /*
         *   To edit the title and description of the Audio      
         *
         */ 
        editAudioTitle :function(eventName){  
//          var docId = eventName.currentTarget.id;             // id to get corresponding Audio   
            var datas = {
				"type" : 'Audio',
				"title" : '',
                                "description" :''
			  }
            BS.mediaeditview = new  BS.MediaEditView();
            BS.mediaeditview.render(datas);
            $('#gdocedit').html(BS.mediaeditview.el);
            },
        
         /**
         * Function for show spreadsheet
         * 
         */
        spreadsheet :function(eventName){
             content= '<div class="hover-div"><img class="cover-picture" src="images/video_image.png"/><div class="hover-text"><div class="image-wrapper"><a id="profile-videos" href="#videos"><img src="images/image2.jpg"></a>'
                        +'</div></div><div class="comment-wrapper comment-wrapper1"> <a class="common-icon video" href="#"></a>'
                        +'<ul class="comment-list">'
                        +'<li><a class="eye-icon" href="#">87</a></li>'
                        +'<li><a class="hand-icon" href="#">5</a></li>'
                        +'<li><a class="message-icon" href="#">10</a></li></ul></div>';
                        $('#coverspreadsheet').html('content');  
        },
        
         /**
         * Function for show presentation
         * 
         */
        presentation :function(eventName){
            var self = this;
            $.ajax({
                        type : 'GET',
                        url :  BS.getAllPPTFilesForAUser,
                        dataType : "json",
                        success : function(ppts) {
//                            if(docs.length != 0)  {
                              _.each(ppts, function(ppt) {
                                   var datVal =  self.formatDateVal(ppt.creationDate);     
                            var content= '<div class="image-wrapper hovereffect" id="'+ppt.id.id+'">'
                                        +' <div class="hover-div"><img class="cover-picture" src="images/presentations_image.png">'
                                        +'<div class="hover-text">'               
                                        +'<div class="comment-wrapper">'                                
                                        +'<a href="#presentationview" style="text-decoration: none">'
                                        +' <div id="media-'+ppt.id.id+'" >'
                                        +' <h4 id="name-'+ppt.id.id+'">'+ppt.documentName+'</h4>'                                
	                                +'<div class="description-info"><div class="description-left"><p id="description-'+ppt.id.id+'" class="doc-description">'+ppt.documentDescription+'</p></div></a>'
                                        +' <div id="'+ppt.id.id+'" class="comment-wrapper2">'
                                        +'<a href="#" class="tag-icon" data-original-title="Search by Users"></a>   <a href="#" class="hand-icon rock_docs"></a>'
	                                +'<a href="#" class="message-icon"></a>    <a href="#" class="share-icon"></a>'
                                        +'</div></div></div>'
	                                +'<h5 class="presentationtitle" id="'+ppt.id.id+'"><span><img src="images/title-plus.png"></span> Title & Description</h5>'          
	                                +'<div class="dateinfo"><span class="state">State</span><span class="date">'+datVal+'</span></div>'
	                                +'</div></div></div>'
	                                +'<div class="comment-wrapper1"> <a class="common-icon presentation" href="#"></a>'
	                                +'<ul id="'+ppt.id.id+'-activities" class="comment-list">'
	                                +'<li><a class="eye-icon" href="#">0</a></li>'
	                                +'<li><a class="hand-icon" href="#">'+ppt.documentRocks+'</a></li>'
	                                +'<li><a class="message-icon" href="#">0</a></li>'
	                                +'</ul>'
	                                +'</div>';
                               $('#coverpresentation').html(content); 
                               
                              });
//                        }
                        }
               });
            
        },
        
        /*
         *   To edit the title and description of the presentation file      
         *
         */ 
        editPresentationTitle :function(eventName){  
            var pptId = eventName.currentTarget.id;             // id to get corresponding presentation   
           $.ajax({                                       
                        type : 'POST',
                        url :  BS.getOneDocs,
                        data : {
                                documentId: pptId  
                                },
                        dataType : "json",
                        success : function(ppts) {                          
                             var pptdatas = {
                             "id" : ppts[0].id.id,
                             "url" : ppts[0].documentURL,
                             "type" : 'Docs',
                             "title" : ppts[0].documentName,
                             "description" : ppts[0].documentDescription
			  }
            BS.mediaeditview = new  BS.MediaEditView();
            BS.mediaeditview.render(pptdatas);
            $('#edit-popup').html(BS.mediaeditview.el);
            $('#edit-bootstrap_popup').modal('show');
                        }
           });
            },
        
         /**
         * Function for show pdffiles
         * 
         */
        pdffiles :function(eventName){
            
            
               var self = this;
            $.ajax({
                        type : 'GET',
                        url :  BS.getAllPDFFilesForAUser,
                        dataType : "json",
                        success : function(pdfs) {
//                            if(docs.length != 0)  {
                              _.each(pdfs, function(pdf) {
                                   var datVal =  self.formatDateVal(pdf.creationDate);     
             
                             var content= '<div class="image-wrapper hovereffect" id="'+pdf.id.id+'">'
                                        +' <div class="hover-div"><img class="filmedia-picture" src="'+pdf.previewImageUrl+'">'
                                        +'<div class="hover-text">'               
                                        +'<div class="comment-wrapper">'                                
                                        +'<a href="#pdflistview" style="text-decoration: none">'
                                        +' <div id="media-'+pdf.id.id+'" >'
                                        +' <h4 id="name-'+pdf.id.id+'">'+pdf.name+'</h4>'                                
	                                +'<div class="description-info"><div class="description-left"><p id="description-'+pdf.id.id+'" class="doc-description">'+pdf.description+'</p></a>'
                                        +' <div id="'+pdf.id.id+'" class="comment-wrapper2">'
                                        +'<a href="#" class="tag-icon" data-original-title="Search by Users"></a>   <a href="#" class="hand-icon rock_docs"></div></div></a>'
	                                +'<a href="#" class="message-icon"></a>    <a href="#" class="share-icon"></a>'
                                        +'</div></div></div>'
	                                +'<h5 class="pdftitle" id="'+pdf.id.id+'"><span><img src="images/title-plus.png"></span> Title & Description</h5>'          

	                                +'<div class="dateinfo"><span class="state">State</span><span class="date">'+datVal+'</span></div>'
	                                +'</div></div></div>'

	                                +'<div class="comment-wrapper1"> <a class="common-icon pdf" href="#"></a>'
	                                +'<ul id="'+pdf.id.id+'-activities" class="comment-list">'
	                                +'<li><a class="eye-icon" href="#">0</a></li>'
	                                +'<li><a class="hand-icon" href="#">'+pdf.documentRocks+'</a></li>'
	                                +'<li><a class="message-icon" href="#">0</a></li>'
	                                +'</ul>'
	                                +'</div>';
         
                               $('#coverpdf').html(content); 
                               
                              });
//                        }
                        }
               });
            
            
            
        },
        
        /*
         *   To edit the title and description of the pdffilelist      
         *
         */ 
        editPdfTitle :function(eventName){  
         var pdfId = eventName.currentTarget.id;             // id to get corresponding pdf file                          
              $.ajax({                                       
                        type : 'POST',
                        url :  BS.getOneDocs,
                        data : {
                                documentId: pdfId  
                                },
                        dataType : "json",
                        success : function(pdfs) {   
                             var pdfdatas = {
                             "id" : pdfs[0].id.id,
                             "url" : pdfs[0].documentURL,
                             "type" : 'Docs',
                             "title" : pdfs[0].documentName,
                             "description" : pdfs[0].documentDescription
			  }
            BS.mediaeditview = new  BS.MediaEditView();
            BS.mediaeditview.render(pdfdatas);
            $('#edit-popup').html(BS.mediaeditview.el); 
            $('#edit-bootstrap_popup').modal('show');
                  }
                    });
        },         
        
         /**
         * Function for show links
         * 
         */
        links :function(eventName){
             content= '<div class="hover-div"><img class="cover-picture" src="images/video_image.png"/><div class="hover-text"><div class="image-wrapper"><a id="profile-videos" href="#videos"><img src="images/image2.jpg"></a>'
                        +'</div></div><div class="comment-wrapper comment-wrapper1"> <a class="common-icon video" href="#"></a>'
                        +'<ul class="comment-list">'
                        +'<li><a class="eye-icon" href="#">87</a></li>'
                        +'<li><a class="hand-icon" href="#">5</a></li>'
                        +'<li><a class="message-icon" href="#">10</a></li></ul></div>';
                        $('#coverlink').html(content);  
        },
                
        /*
         * Format date and returns 
         */
        formatDateVal: function(dateVal)
        {
        	
            var m_names = new Array("January", "February", "March", 
						            "April", "May", "June", "July", "August", "September", 
						            "October", "November", "December");
            var d = new Date(dateVal);
            var curr_date = d.getDate();
            var curr_month = d.getMonth() + 1; //Months are zero based
            var curr_year = d.getFullYear();
            return curr_date + " " + m_names[d.getMonth()] + ", " + curr_year;
        },
        
        /**
         * 
         * Function for uploadmedia 
         *  (slide down menu)
         * 
         */
        uploadMediadwn :function(eventName){
            eventName.preventDefault();
            if(!$('#uploadmediachild_dr').is(":visible") )       
              $("#uploadmediachild_dr").slideDown();
        },
        
        /* Function for uploadmedia 
         * (childmenu from Links)
         */
        linksMenuList:function(eventName){
            eventName.preventDefault();
            $("#childtwo_dr").find('ul').hide(200);
            $("#childthree_dr").find('ul').hide(200);
            $("#childfour_dr").find('ul').hide(200);
            $("#childfive_dr").find('ul').hide(200);
            $("#linksmenu_dr").animate({width: 'toggle'},120);
                 var i='';
                 var content='';       
             $.ajax({
                        type : 'GET',
			url : BS.allStreamsForAUser,
			dataType : "json",
			success : function(options) {
								content+='<option>Save to Class</option>'
                             _.each(options, function(option) {
	                              content+= '<option>'+option.streamName+'</option>';
	                              i++;
                              });
							  content+='<option>Profile</option>'
									   +'<option>My Docs</option>';             
                              $('#link-class-list').html(content); 
                              }
					
					  
		 });
                 
            },
            
        
        /*
         * Function for uploadmedia 
         * (linksupload button)
         *
         */
        linkupload: function(eventName){
            eventName.preventDefault();
            $("#dropdownnew").find('ul').hide(250); 
        },
        
        /*
         * Function for uploadmedia 
         * (childmenu from papers and docs)
         */
        docsMenuList:function(eventName){
            eventName.preventDefault();
            $("#childone_dr").find('ul').hide(100);
            $("#childthree_dr").find('ul').hide(200);
            $("#childfour_dr").find('ul').hide(200);
            $("#childfive_dr").find('ul').hide(200);
            $("#docsmenu_dr").animate({width: 'toggle'},150);
        },
        
        /*
         * Function for uploadmedia 
         * (childmenu from googledocs)
         */
         showFileForm:function(eventName){
            eventName.preventDefault();
            $("#childtwo_two_dr").find('ul').hide(200);
            $("#dooclinkchild_dr").animate({width: 'toggle'},130);
            //select box for stream
            var i='';
            var optioncontent=''; 
            $.ajax({
			type : 'GET',
			url : BS.allStreamsForAUser,
			dataType : "json",
                        success : function(options) {
                        	 optioncontent+='<option>Save to Class</option>'
                             _.each(options, function(option) {
	                              optioncontent+= '<option value="'+option.id.id+'">'+option.streamName+'</option>';
	                              i++;
                              });
                        	  
                              $('#doc-class-list-computer').html(optioncontent); 
                              }
					
					  
		 });
            
        },
        
        
        /*
         * Function for uploadmedia 
         * (childmenu from googledocs)
         */
         googleDocs:function(eventName){
            eventName.preventDefault();
            $("#childtwo_one_dr").find('ul').hide(200);
            $("#googledocschild_dr").animate({width: 'toggle'},130);
        },
        
        /*
         * Function for uploadmedia 
         * (childmenu from Import from link )
         */
        importFromLink:function(eventName){
            eventName.preventDefault();
            $("#frmlinkchild_dr").animate({width: 'toggle'},150);
            var i='';
            var content=''; 
            $.ajax({
			type : 'GET',
			url : BS.allStreamsForAUser,
			dataType : "json",
                        success : function(options) {
                            
                        	 content+='<option>Save to Class</option>'
                             _.each(options, function(option) {
	                              content+= '<option value="'+option.id.id+'">'+option.streamName+'</option>';
	                              i++;
                              });
                              $('#doc-class-list').html(content); 
                              }
					
					  
		 });
                 
            
            
        },
               
         /*
         *Function for uploadmedia 
         * (childmenu from video)
         */
        videoMenuList:function(eventName){
            eventName.preventDefault();
            $("#childone_dr").find('ul').hide(200);
            $("#childtwo_dr").find('ul').hide(200);
            $("#childfour_dr").find('ul').hide(200);
            $("#childfive_dr").find('ul').hide(200);
            $("#videomenu_dr").animate({width: 'toggle'},130);
        },
        
         /*
         *Function for uploadmedia 
         * (childmenu from youtube)
         */
        youtubeMenu:function(eventName){
            eventName.preventDefault();
            $("#youtubechild_dr").animate({width: 'toggle'},350);
            var i='';
            var content=''; 
            $.ajax({
			type : 'GET',
			url : BS.allStreamsForAUser,
			dataType : "json",
			success : function(options) {
				            content+='<option>Save to Class</option>'
                            _.each(options, function(option) {
	                             content+= '<option>'+option.streamName+'</option>';
	                             i++;
                             });
				            content+='<option>Profile</option>'
								   +'<option>My Docs</option>';
                            $('#video-class-list').html(content);
                         }		  
		 });
        },
        
        /*
         *Function for uploadmedia 
         * (childmenu from youtube and upload video)
         */
        videoUpload:function(eventName){
            eventName.preventDefault();
            $("#dropdownnew").find('ul').hide(250); 
        },
        
        /*
         *Function for uploadmedia 
         * (childmenu from audio)
         */
        
        audioMenuList:function(eventName){
            eventName.preventDefault();
            $("#childone_dr").find('ul').hide(200);
            $("#childtwo_dr").find('ul').hide(200);
            $("#childthree_dr").find('ul').hide(200);
            $("#childfive_dr").find('ul').hide(200);
            $("#audiomenu_dr").animate({width: 'toggle'},150);
        },
        
        /*
         *Function for uploadmedia 
         * (childmenu from audio vialink)
         */
        audioVialink:function(eventName){
            eventName.preventDefault();
            $("#vialinkchild_dr").animate({width: 'toggle'},350); 
            var i='';
            var content=''; 
            $.ajax({
                    type : 'GET',
                    url : BS.allStreamsForAUser,
                    dataType : "json",
                    success : function(options) {
                        	content+='<option>Save to Class</option>'
                            _.each(options, function(option) {
                                 content+= '<option>'+option.streamName+'</option>';
                                 i++;
                              });
                        	  content+='<option>Profile</option>'
								+'<option>My Docs</option>';
                              $('#audio-class-list').html(content); 
                              }	  
		 });
        },
        
         /*
         * Function for uploadmedia 
         * (upload button to upload audio)
         */
        audioUpload:function(eventName){
            eventName.preventDefault();
            $("#dropdownnew").find('ul').hide(200); 
        },
    
        /*
         * Function for uploadmedia 
         * (childmenu from presentation)
         *
         */
        presentationMenuList:function(eventName){
            eventName.preventDefault();
            $("#childone_dr").find('ul').hide(200);
            $("#childtwo_dr").find('ul').hide(200);
            $("#childfour_dr").find('ul').hide(200);
            $("#childthree_dr").find('ul').hide(200);
            $("#presentationmenu_dr").animate({width: 'toggle'},150);
        },
        
         /*
         * Function for uploadmedia 
         * (childmenu from presentation vialink)
         *
         */
        presentationVialink:function(eventName){
            eventName.preventDefault();
            $("#presvialinkchild_dr").animate({width: 'toggle'},350);
            var i='';
            var content=''; 
            $.ajax({
			type : 'GET',
			url : BS.allStreamsForAUser,
			dataType : "json",
			success : function(options) {
							  content+='<option>Save to Class</option>'
                              _.each(options, function(option) {
                                 content+= '<option>'+option.streamName+'</option>';
                              i++;
                              });
                              content+='<option>Profile</option>'
									+'<option>My Docs</option>';
                              $('#presentation-class-list').html(content); 
                              }	  
		 });
        },
        
         /*
         * Function for uploadmedia 
         * (upload button to upload presentation)
         *
         */
        presentationUpload:function(eventName){
            eventName.preventDefault();
            $("#dropdownnew").find('ul').hide(250); 
        },
    
        /**
         * For uploadmedia menu
         *  for slide up
         */
        uploadMediaup :function(eventName){
             eventName.preventDefault();
             if(!$('.fixingmenu_dr').is(":visible") ) 
             $("#uploadmediachild_dr").slideUp(50); 
        },
        
        /**
         * Edited By Aswathy @TODO
         * For Doc popups
         */
        showDocPopup :function(eventName){
 
        	var docId = eventName.currentTarget.id;
        	var docUrl = $('input#id-'+docId).val();
    		newwindow=window.open(docUrl,'','height=550,width=1100,top=100,left=250');
        	 
        },
       
        
        /*
         * Save docs from My computer
         */
         saveMyFile: function(eventName)
         {
                eventName.preventDefault();
                 var self = this;
                var status = true;
                var message ='';
                var streamId = $("#doc-class-list-computer").val();
                
                //get message access private ? / public ?
                var docAccess;
                var access =  $('#id-private').attr('checked');
                if(access == "checked")
                {
                	docAccess = "Private";
                }
                else
                {
                	docAccess = "Public";
                }
                
                var data;
                data = new FormData();
                data.append('streamId', streamId);
                data.append('docAccess' ,docAccess);
                data.append('docData', this.image);  
                data.append('docDescription',message);
                document.getElementById('loader-message').innerHTML="<img src='images/loading.gif'>";
                
                /* post profile page details */
                $.ajax({
                    type: 'POST',
                    data: data,
                    url: BS.uploaddocFrmComputer,
                    cache: false,
                    contentType: false,
                    processData: false,
                    dataType : "json",
                    success: function(data){
                        if(data!== " ") 
                            {
                                document.getElementById('loader-message').innerHTML = data.message;
                                self.docsList();
                                self.docFromComputer();
                                self.audio();
                                self.presentation();
                                self.pdffiles();  
                                $("#dooclinkchild_dr").hide(200);
                            }
                    }
                }); 
         },
         
             /**
     * display profile photo
     */
    
    displayImage:function (e) {
    	 var self = this;;
    	 file = e.target.files[0];
    	 
    	
         var reader = new FileReader();
      
        	 /* capture the file informations */
             reader.onload = (function(f){
            	 
            	 self.image = file;
            	
            })(file);
             
            // read the image file as data URL
            reader.readAsDataURL(file);
         
    },
    
    hidePopUpBlock: function()
    {
            $("#dooclinkchild_dr").find('ul').hide(100);
            $("#docsmenu_dr").find('ul').hide(200);
            $("#childtwo_dr").find('ul').hide(200);
            $("#uploadmediachild_dr").find('ul').hide(200);
    }
});

