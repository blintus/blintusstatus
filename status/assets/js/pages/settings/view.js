define(['jquery', 
		'hbs!pages/settings/markup',
		'hbs!pages/settings/contactMethodMarkup'
	], function ($, pageMarkup, contactMethodMarkup) {
    
    'use strict';

    /**
     * Constructor for a settings view
     *
     * @class SettingsView
     * @constructor
     * @param {Store} store The store for the app
     * @param {jQuery} $container A jQuery object for the root content container
     */
    var SettingsView = function (store, controller, $container) {
        this.store = store;
        this.controller = controller;
        $container.append(pageMarkup());
        this.$contactMethodContainer = $container.find("#contact-methods");
    };

    /**
     * Initializes the view with data
     *
     * @method init
     */
    SettingsView.prototype.init = function () {
        var that = this;

        this._loadContactMethods();

        this._initEventListeners();
    };

    /**
     * Initializes the event listeners for the view
     *
     * @method _initEventListeners
     * @private
     */
    SettingsView.prototype._initEventListeners = function () {
        var that = this;

        // Bind listeners

    };

    SettingsView.prototype._loadContactMethods = function () {
    	var that = this,
    		contactMethods,
    		categories;

    	contactMethods = this.controller.getContactMethods();
    	categories = this.controller.getCategories();

    	this.$contactMethodContainer.empty().append(contactMethodMarkup({
    		contactMethods: contactMethods,
    		categories: categories
    	}));
    }

    return SettingsView;

});