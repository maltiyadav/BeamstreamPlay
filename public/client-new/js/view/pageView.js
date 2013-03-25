/*
 * Author: Viet Doan
 * ClassName: PageView
 * Extends: Backbone.View
 * Objective: Manage Child Views
 */
define([ 'container'], function(Container) {

	var PageView;
	PageView = Container.extend({
		objName : 'PageView',
		events : {
			'click a[data-toggle="popover"]' : 'togglePopover'
		},
		constructor : function() {
			__content = __content || {};
			this.data = __content;
			if (this.constructor.__super__.events) {
				var node = this.constructor.__super__;
				while (node instanceof Backbone.View) {
					this.events = _.extend({}, this.events, node.events);
					node = node.constructor.__super__;
				}
				Backbone.View.apply(this, arguments);
			} else {
				this.constructor.__super__.constructor.apply(this, arguments);
			}
		},
		initialize : function() {
			_.bindAll(this, 'init');
			this.init();
			this._onAfterInit();
			
			$('a[data-toggle="tab"]').live('shown', this.onTabShown);
		},
		_onAfterInit : function() {

			this.onAfterInit();
			return this;
		},
		onAfterInit : function() {
		},
		init : function() {
		},
		showAll : function() {
			_.each(this.children, function(view) {
				view.render();
			});
		},
		tabHandler : function(e) {
			return this;
		},
		togglePopover : function(e) {
			e.preventDefault();
			return this;
		}

	});

	return PageView;
});
