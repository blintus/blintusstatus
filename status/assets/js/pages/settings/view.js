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

        // Bind checkbox cell click
        this.$contactMethodContainer.on('click', '.settings-category-cell', function (event) {
        	$(event.target).find('input[type="checkbox"]').click();
        });

        // Bind checkbox click
        this.$contactMethodContainer.on('click', '.settings-category-checkbox', function (event) {
            var contactmethodid = $(event.target).data('contactmethodid'),
                categoryid      = $(event.target).data('categoryid');
            $.ajax({
            	type: "POST",
            	url: "/rest/subscriptions",
            	data: { contactmethodid: contactmethodid, categoryid: categoryid, subscribed: !event.target.checked}
            })
            .done(function( msg ) {
                alert( msg );
            });
        });
    };

    SettingsView.prototype._loadContactMethods = function () {
    	var contactMethods,
    		categories,
            subscriptions;

    	contactMethods = this.controller.getContactMethods();
    	categories = this.controller.getCategories();
        subscriptions = this.controller.getSubscriptions();
        
        // Create subscription table
    	this.$contactMethodContainer.empty().append(contactMethodMarkup({
    		contactMethods: contactMethods,
    		categories: categories
    	}));

        // Check correct checkbox's
        var sub_len = Object.keys(subscriptions).length;
        for (var key in subscriptions) {
            var con = subscriptions[key].contactMethod;
            var cat = subscriptions[key].category;
            this.$contactMethodContainer.find('input[type="checkbox"]').filter( function() { 
                    return $(this).attr('data-contactmethodid').match(con); 
                }).filter( function() { 
                    return $(this).attr('data-categoryid').match(cat); 
                }).prop('checked', true);
        }
    }

    return SettingsView;

});