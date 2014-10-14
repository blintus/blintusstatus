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
        this._loadContactMethods();
        this._initEventListeners();
        this._initModals();
    };


    SettingsView.prototype._initModals = function () {
        var that = this;

        var title = 'Add an Email Address',
            body = emailMarkup,
            cancelBtn = 'Nope Nope Nope...',
            okBtn = 'Send to NSA',
            submitCallback = function (formData) {
                var email = formData.email;

                if (email) {
                    var p1 = that.controller.saveContactMethod(email, '', '');
                    $.when(p1).done(function (response) {
                        that.controller.updateContactMethod(response.contactMethod, true);
                        that._loadContactMethods();
                    });
                } else {
                    alert('Bad data');
                }
            };
        that.addEmailModal = new modals.FormModal({'title': title, 'body': body, 'cancelBtn': cancelBtn, 'okBtn': okBtn, 'submitCallback': submitCallback});

        var providers = this.controller.getProviders();
        title = 'Add a Phone Number';
        body = phoneNumberMarkup({ providers: providers });
        cancelBtn = 'Nope Nope Nope...';
        okBtn = 'Send to NSA';
        submitCallback = function (formData) {
            var phoneNumber = formData.phoneNumber,
                provider = formData.provider;

                if (phoneNumber && provider) {
                    var p1 = that.controller.saveContactMethod('', phoneNumber, provider);
                    $.when(p1).done(function (response) {
                        that.controller.updateContactMethod(response.contactMethod, true);
                        that._loadContactMethods();
                    });
                } else {
                    alert('Bad data');
                }
        };
        that.addPhoneNumberModal = new modals.FormModal({'title': title, 'body': body, 'cancelBtn': cancelBtn, 'okBtn': okBtn, 'submitCallback': submitCallback});
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

        that.$subscriptionContainer.on('click', '.add-phone-number-btn', function (event) {
            that.addPhoneNumberModal.reset().show();
        });

        // Remove a contact method
        that.$subscriptionContainer.on('click', '.remove-contact-method', function (event) {
            event.stopPropagation();

            var pk = $(event.target).data('pk'),
                name = $(event.target).data('name'),
                confirmDelete = confirm("Remove contact method: " + name + "?");

            if (confirmDelete === true) {
                var p1 = that.controller.removeContactMethod(pk);
                $.when(p1).done(function (response) {
                    that.controller.updateContactMethod(response.contactMethod, false);
                    that._loadContactMethods();
                });
            }
        });
    };

    SettingsView.prototype._loadContactMethods = function () {
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
        var sub_len = Object.keys(subscriptions).length;

        for (var key in subscriptions) {
            var con = subscriptions[key].contactMethod;
            var cat = subscriptions[key].category;
            var checkboxes = this.$subscriptionContainer.find('input[type="checkbox"]').filter('[data-contactmethodid="' + con + '"]').filter('[data-categoryid="' + cat + '"]').prop('checked', true);
        }
    };

    return SettingsView;

});