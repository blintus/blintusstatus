define(['jquery', 
		'hbs!pages/settings/markup',
		'hbs!pages/settings/contactMethodMarkup',
        'hbs!pages/settings/addContactMethodMarkup'
	], function ($, pageMarkup, contactMethodMarkup, addContactMethodMarkup) {
    
    'use strict';

    /**
     * Constructor for a settings view
     *
     * @class pages.settings.SettingsView
     * @constructor
     * @param {jQuery} $container A jQuery object for the root content container
     */
    var SettingsView = function (controller, $container) {
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
            });
        });

        this.$addContactMethodContainer.on('submit', '.submit-new-contact-method', function (event) {
            var message = that.$addContactMethodContainer.data('new-contact-method');

            console.log(message);

            alert(message);
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

        this.$addContactMethodContainer.empty().append(addContactMethodMarkup({

        }));
    };

    return SettingsView;

});