define(['jquery', 
		'hbs!pages/settings/markup',
		'hbs!pages/settings/contactMethodMarkup'
	], function ($, pageMarkup, contactMethodMarkup) {
    
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

        // Add a subscription by clicking on cell
        that.$contactMethodContainer.on('click', '.settings-category-cell', function (event) {
        	$(event.target).find('input[type="checkbox"]').click();
        });

        // Add a subscription by clicking checkbox
        that.$contactMethodContainer.on('click', '.settings-category-checkbox', function (event) {
            var contactmethodid = $(event.target).data('contactmethodid'),
                categoryid      = $(event.target).data('categoryid');
            var p = that.controller.updateSubscription(contactmethodid, categoryid, event.target.checked);
            $.when(p[0], p[1]).done(function () {
                that._loadContactMethods();
            });
        });

        var disableEmail = function () {
            that.$contactMethodContainer.find('.new-contact-method-email').prop('disabled', true);
        };

        var enableEmail = function () {
            that.$contactMethodContainer.find('.new-contact-method-email').prop('disabled', false);
        };

        var disablePhoneNumber = function () {
            that.$contactMethodContainer.find('.new-contact-method-phone-number').prop('disabled', true);
            that.$contactMethodContainer.find('.new-contact-method-provider').prop('disabled', true);
        };

        var enablePhoneNumber = function () {
            that.$contactMethodContainer.find('.new-contact-method-phone-number').prop('disabled', false);
            that.$contactMethodContainer.find('.new-contact-method-provider').prop('disabled', false);
        };

        that.$contactMethodContainer.on('keyup', '.new-contact-method-email', function (event) {
            if (that.$contactMethodContainer.find('.new-contact-method-email').val() === '') {
                enablePhoneNumber();
            }
            else {
                disablePhoneNumber();
            }
        });

        that.$contactMethodContainer.on('keyup', '.new-contact-method-phone-number', function (event) {
            if (that.$contactMethodContainer.find('.new-contact-method-phone-number').val() === '') {
                enableEmail();
            }
            else {
                disableEmail();
            }
        });

        that.$contactMethodContainer.on('click', '.new-contact-method-provider', function (event) {
            if (that.$contactMethodContainer.find('.new-contact-method-provider').val() === '') {
                enableEmail();
            }
            else {
                disableEmail();
            }
        });

        // Add a contact method
        that.$contactMethodContainer.on('click', '.submit-new-contact-method', function (event) {
            var email = that.$contactMethodContainer.find('.new-contact-method-email').val(),
                phoneNumber = that.$contactMethodContainer.find('.new-contact-method-phone-number').val(),
                provider = that.$contactMethodContainer.find('.new-contact-method-provider').val();

            if (((email && (phoneNumber === '') && (provider === '')) || ((email === '') && phoneNumber && (provider !== '')))) {
                var p1 = that.controller.saveContactMethod(email, phoneNumber, provider);
                $.when(p1).done(function () {
                    that._loadContactMethods();
                });
            } else {
                alert('Bad data');
            }
        });

        // Remove a contact method
        that.$contactMethodContainer.on('click', '.remove-contact-method', function (event) {
            event.stopPropagation();

            var pk = $(event.target).data('pk'),
                name = $(event.target).data('name'),
                confirmDelete = confirm("Remove contact method: " + name + "?");

            if (confirmDelete === true) {
                var p1 = that.controller.removeContactMethod(pk);
                $.when(p1).done(function () {
                    that._loadContactMethods();
                });
            }
        });
    };

    SettingsView.prototype._loadContactMethods = function () {
    	var contactMethods,
    		categories,
            subscriptions,
            providers;

    	contactMethods = this.controller.getContactMethods();
    	categories = this.controller.getCategories();
        subscriptions = this.controller.getSubscriptions();
        providers = this.controller.getProviders();
        
        // Create subscription table
    	this.$contactMethodContainer.empty().append(contactMethodMarkup({
    		contactMethods: contactMethods,
    		categories: categories,
            providers: providers
    	}));

        // Check correct checkbox's
        var sub_len = Object.keys(subscriptions).length;

        for (var key in subscriptions) {
            var con = subscriptions[key].contactMethod;
            var cat = subscriptions[key].category;
            var checkboxes = this.$contactMethodContainer.find('input[type="checkbox"]').filter('[data-contactmethodid="' + con + '"]').filter('[data-categoryid="' + cat + '"]').prop('checked', true);
        }
    };

    return SettingsView;

});