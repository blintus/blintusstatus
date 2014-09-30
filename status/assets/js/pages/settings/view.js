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
        this.$addContactMethodContainer = $container.find("#add-contact-methods");
        
    };

    /**
     * Initializes the view with data
     *
     * @method init
     */
    SettingsView.prototype.init = function () {

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

        // Bind show comments links
        this.$contactMethodContainer.on('click', '.settings-category-checkbox', function (event) {
            $(event.target).find('input[type="checkbox"]').click()
            var contactMethod = $(event.target).data('contactmethodid'),
                category      = $(event.target).data('categoryid');
            console.log(contactMethod);
            console.log(category);
        });
//        $('#checkboxtable').on('click', '.checkbox-class', function (event) { /do things/ });

    };

    SettingsView.prototype._loadContactMethods = function () {
    	var contactMethods,
    		categories,
            subscriptions;

    	contactMethods = this.controller.getContactMethods();
    	categories = this.controller.getCategories();
        subscriptions = this.controller.getSubscriptions();

    	this.$contactMethodContainer.empty().append(contactMethodMarkup({
    		contactMethods: contactMethods,
    		categories: categories,
            subscriptions: subscriptions
    	}));
    }

    return SettingsView;

});