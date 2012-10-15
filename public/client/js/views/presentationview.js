BS.PresentationView = Backbone.View.extend({ 
        events:{
                "click .presentationpopup" : "presentationpopup",
                "click .presentationtitle" : "editPresentationTitle",
                "click .rock_docs" : "rocksDocuments",
                "click .show_rockers" : "showDocRockers"
         },
    
        initialize:function(){
            this.source = $("#tpl-docsview").html();
            this.template = Handlebars.compile(this.source);
            this.presentation();         
        },
        
        render:function (eventName) {
            $(this.el).html(this.template);
            return this;
            },
                        
        presentation :function(eventName){
//            $('.coveraud').html('content');
            var i = 1;
            var self = this;
            var content='';
            $.ajax({
                        type : 'GET',
                        url :  BS.getAllPPTFilesForAUser,
                        dataType : "json",
                        success : function(ppts) {
//                              if(docs.length != 0)  {
                                $('#grid').html(""); 
                              _.each(ppts, function(ppt) { 
                                BS.filesMediaView = new BS.FilesMediaView();  
                                var datVal = BS.filesMediaView.formatDateVal(ppt.creationDate);     
                                var pptdata={
                                               "ppt" : ppt,
                                               "datVal" :datVal,
                                               "count":i
                                                }  
                                var source = $('#tpl-single-presentation').html();          //creating single bucket view for presentation list view                           
                                var template = Handlebars.compile(source);
                                $('#grid').append(template(pptdata));                    
                                i++;   
                              });
                        }
               });                      
        },
        
        /*
         *   To show the presentation view in popup        
         *
         */ 
        presentationpopup :function(eventName){          
            var pptId = eventName.currentTarget.id;   
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
                        "type" : 'Pdf',
                        "title" : ppts[0].documentName
			  }
           BS.mediafilepopupview = new BS.MediaFilePopupView();
           BS.mediafilepopupview.render(pptdatas);          
           $('#gdocedit').html(BS.mediafilepopupview.el);      
                  }
                    });     
            
            
        },
        
        /*
         *   To edit the title and description of the presentation file      
         *
         */ 
        editPresentationTitle :function(eventName){  
//          var docId = eventName.currentTarget.id;             // id to get corresponding presentation   
            var datas = {
				"type" : 'Presentation',
				"title" : '',
                                "description" :''
			  }
            BS.mediaeditview = new  BS.MediaEditView();
            BS.mediaeditview.render(datas);
            $('#gdocedit').html(BS.mediaeditview.el);
        },
        /**
         * Rocks PPT files
         */
        rocksDocuments:function(eventName){
     	   
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
         * show PPT Rockers list 
         */
        showDocRockers :function(eventName){
     	   eventName.preventDefault();
     	   var element = eventName.target.parentElement; 
           var documentId =$(element).closest('div').parent('div').attr('id');
     	   $.ajax({
                type: 'POST',
                url:BS.documentRockers,
                data:{
               	  documentId:documentId
                },
                dataType:"json",
                success:function(data){
               	 
               	  // prepair rockers list
                 var ul = '<div style="font:italic bold 12px Georgia, serif; margin:0 0 10px;">Who Rocked it ?</div><ul class="rock-list">';
               	_.each(data, function(rocker) { 					 
               		ul+= '<li>'+rocker+'</li>';
   			    });
               	ul+='</ul>';   
               	$('#'+documentId+'-docRockers-list').fadeIn("fast").delay(1000).fadeOut('fast'); 
               	$('#'+documentId+'-docRockers-list').html(ul);

                }
             });
     	   
        },
            
})