define(['jquery', 
		'hbs!pages/settings/markup',
		'hbs!pages/settings/emailMarkup',
        'hbs!pages/settings/phoneNumberMarkup',
        'hbs!pages/settings/subscriptionMarkup',
        'shared/modals'
	], function ($, pageMarkup, emailMarkup, phoneNumberMarkup, subscriptionMarkup, modals) {
    
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
        this.$subscriptionContainer = $container.find("#subscriptions");
        this.addContactMethodModal = null;
    };

    /**
     * Initializes the view with data
     *
     * @method init
     */
    SettingsView.prototype.init = function () {
        this._loadSubscriptions();
        this._initEventListeners();
        this._initModals();
    };

    /**
     * Initializes two modals for adding contact methods
     * one for an email addresas and another for adding a phone number
     *
     * @method _initModals
     * @private
     */
    SettingsView.prototype._initModals = function () {
        var that = this;
        
        that.addEmailModal = new modals.FormModal({
            'title': 'Add an Email Address', 
            'body': emailMarkup, 
            'cancelBtn': 'Nope Nope Nope...', 
            'okBtn': 'Send to NSA', 
            'submitCallback': function (formData) {
                var email = formData.email;
                if (email) {
                    $.when(that.controller.saveContactMethod(email, '', '')).done(function (response) {
                        that._loadSubscriptions();
                    });
                } else {
                    new modals.MessageModal({
                        'title': 'I Can Has Personal Information?',
                        'body': 'Please provide an email address'
                    });
                }
            }
        });

        var providers = this.controller.getProviders();
        that.addPhoneNumberModal = new modals.FormModal({
            'title': 'Add a Phone Number', 
            'body': phoneNumberMarkup({ providers: providers }), 
            'cancelBtn': 'Nope Nope Nope...', 
            'okBtn': 'Send to NSA', 
            'submitCallback': function (formData) {
                var phoneNumber = formData.phoneNumber,
                    provider    = formData.provider;
                    if (phoneNumber && provider) {
                        $.when(that.controller.saveContactMethod('', phoneNumber, provider)).done(function (response) {
                            that._loadSubscriptions();
                        });
                    } else {
                        new modals.MessageModal({
                            'title': 'I Can Has Personal Information?',
                            'body': 'Please provide a phone number and provider'
                        });
                    }
            }
        });
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
        that.$subscriptionContainer.on('click', '.settings-category-cell', function (event) {
        	$(event.target).find('input[type="checkbox"]').click();
        });

        // Add a subscription by clicking checkbox
        that.$subscriptionContainer.on('click', '.settings-category-checkbox', function (event) {
            event.preventDefault();
            event.stopPropagation();
            var contactmethodid = $(event.target).data('contactmethodid'),
                categoryid      = $(event.target).data('categoryid');
            $.when(that.controller.updateSubscription(contactmethodid, categoryid, event.target.checked)).done(function (response) {
                    event.target.checked = response.checked;
            });
        });

        // Add an email
        that.$subscriptionContainer.on('click', '.add-email-btn', function (event) {
            that.addEmailModal.reset().show();
        });

        // Add a phone number
        that.$subscriptionContainer.on('click', '.add-phone-number-btn', function (event) {
            that.addPhoneNumberModal.reset().show();
        });

        // Remove a contact method
        that.$subscriptionContainer.on('click', '.remove-contact-method', function (event) {
            event.stopPropagation();

            var pk   = $(event.target).data('pk'),
                name = $(event.target).data('name'),
                confirmDelete = confirm("Remove contact method: " + name + "?");

            if (confirmDelete === true) {
                $.when(that.controller.removeContactMethod(pk)).done(function (response) {
                    that._loadSubscriptions();
                });
            }
        });
    };

    /**
     * Loads subscription table
     *
     * @method _loadSubscriptions
     * @private
     */
    SettingsView.prototype._loadSubscriptions = function () {
    	var contactMethods = this.controller.getContactMethods(),
    		categories = this.controller.getCategories(),
            subscriptions = this.controller.getSubscriptions(),
            providers = this.controller.getProviders();
        
        // Create subscription table
    	this.$subscriptionContainer.empty().append(subscriptionMarkup({
    		contactMethods: contactMethods,
    		categories: categories,
            providers: providers
    	}));

        // Check correct checkbox's
        for (var key in subscriptions) {
            var con = subscriptions[key].contactMethod,
                cat = subscriptions[key].category,
                checkboxes = this.$subscriptionContainer.find('input[type="checkbox"]').filter('[data-contactmethodid="' + con + '"]').filter('[data-categoryid="' + cat + '"]').prop('checked', true);
        }
    };

    return SettingsView;

});