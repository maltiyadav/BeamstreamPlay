define(['view/formView'], function(FormView){
	var PersonView;
	PersonView = FormView.extend({
		objName: 'PersonView',
		events : {
			'click #save' : 'SaveData',
			'click #singleFieldValidation' : 'validateSingleField',
			'click #setField' : 'setSingleField',
			'click #setCollection': 'setCollection',
			'click #post-button' : 'postMessage',
			
		},
		
		onAfterInit: function(){
			
			//this.data.reset();
		},
		/**
		 * save form data
		 */
		postMessage: function(){
			alert(55);
//			dataToSave.isValid(true)
//			console.log(this.getModel());
//			this.data.models[0].set({'san':'te3454'});
			this.saveForm();
//			console.log(this.data.models[0].get('san'));
		},
		
		/**
		 * @TODO how to validate single field ?
		 */
		validateSingleField: function(){
			alert("validate Single Field");
		},
		
		/**
		 * @TODO how to set an attribute to model
		 * like http://documentcloud.github.com/backbone/#Model-set
		 */
		setSingleField: function(){
			this.data.models[0].set('firstName', "Viet");
			this.render();
		},
		setCollection: function(){
			this.set({firstName: 'John', lastName: 'Doe'});
		}
	})
	return PersonView;
});