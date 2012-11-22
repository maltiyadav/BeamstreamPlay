BS.Document = Backbone.Model.extend({
        defaults: {
        id: null,
        name: null, 
        url: null, 
        docType: null, 
        userId: null, 
        docAccess: null, 
        streamId: null,
        docDescription:null,
        creationDate: null, 
        lastUpdateDate: null, 
        rocks: null, 
        rockers: null,
        comments : null
        }
        
});

BS.DocumentCollection = Backbone.Collection.extend({

    model:BS.Document 
	
});
