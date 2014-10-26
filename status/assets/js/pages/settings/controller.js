define(['pageUtils',
		'pages/settings/view',
        'shared/modals'
	], function (pageUtils, SettingsView, modals) {

    'use strict';

    /**
     * Constructor for a settings controller
     *
     * @class pages.settings.SettingsController
     * @contructor
     * @param {jQuery} $container A jQuery object for the root content container
     */
    var SettingsController = function ($container) {
        this.view = new SettingsView(this, $container);
        pageUtils.setTitle("Settings");
        this.loadAllData();
        this.subscriptions = null;
        this.contactMethods = null;
        this.providers = null;
        this.categories = null;

        this.failMessage = function (response) {
            new modals.MessageModal({
                'title': 'Woh! An Error Has Appeared!',
                'body': response.responseJSON.message
            });
        };
    };

    /**
     * Load categories from the server
     *
     * @method loadCategories
     */
    SettingsController.prototype.loadCategories = function () {
        var that = this;
        return $.getJSON("/rest/categories", function (json) {
            that.categories = _.indexBy(json, 'pk');
        });
    };

    /**
     * Load contact methods from the server
     *
     * @method loadContactMethods
     */
    SettingsController.prototype.loadContactMethods = function () {
        var that = this;
        return $.getJSON("/rest/contactMethods", function (json) {
            that.contactMethods = _.indexBy(json, 'pk');
        });
    };

    /**
     * Load providers from the server
     *
     * @method loadProviders
     */
    SettingsController.prototype.loadProviders = function () {
        var that = this;
        return $.getJSON( "/rest/providers", function (json) {
            that.providers = _.indexBy(json, 'pk');
        });
    };

    /**
     * Load subscriptions from the server
     *
     * @method loadSubscriptions
     */
    SettingsController.prototype.loadSubscriptions = function () {
        var that = this;
        return $.getJSON("/rest/subscriptions", function ( json ) {
            that.subscriptions = _.indexBy(json, 'pk');
        });
    };

    /**
     * Load all data from the server
     *
     * @method loadAllData
     */
    SettingsController.prototype.loadAllData = function () {
        var that = this,
            cat_promise  = that.loadCategories(),
            con_promise  = that.loadContactMethods(),
            prov_promise = that.loadProviders(),
            sub_promise  = that.loadSubscriptions();

        $.when(cat_promise, con_promise, prov_promise, sub_promise).done(function () {
            that.view.init();
        });
    };

    /**
     * Updates a contact method in the controller's cache
     *
     * @method loadAllData
     * @private
     * @param {Object}  contact method object to add or delete
     * @param {boolean} true ? add contact method : delete contact method
     */
    SettingsController.prototype.updateContactMethod = function (contactMethod, add) {
        if (add) {
            this.contactMethods[contactMethod.pk] = contactMethod;
        }
        else {
            delete this.contactMethods[contactMethod.pk];
        }
    };

    /**
     * Post subscription update to the server
     *
     * @method loadAllData
     * @private
     * @param {int}     id of the contact method for the subscription
     * @param {int}     id of the category for the subscription
     * @param {boolean} is the checkbox currently checked
     * @return {Array}  A promise for the returned data
     */
    SettingsController.prototype.updateSubscription = function (contactmethodid, categoryid, checked) {
        var that = this;

        return $.ajax({
            dataType: 'JSON',
            type: "POST",
            url: "/rest/subscriptions",
            data: {
                contactmethodid: contactmethodid,
                categoryid: categoryid,
                subscribed: !checked
            }
        }).fail(that.failMessage);
    };

    /**
     * Post new contact method to the server
     *
     * @method loadAllData
     * @private
     * @param {String} email address for the contact method
     * @param {String} phone number for the contact method
     * @param {int}    pk of the provider for the contact method
     * @return {Array} A promise for the returned data
     */
    SettingsController.prototype.saveContactMethod = function (email, phoneNumber, provider) {
        var that = this,
            promise = $.Deferred(),
            request = $.ajax({
                dataType: 'JSON',
                type: "POST",
                url: "/rest/contactMethods",
                data: {
                    email: email,
                    phoneNumber: phoneNumber,
                    provider: provider,
                    subscribed: false
                }
            }).fail(that.failMessage);

        $.when(request).done(function (response) {
            that.updateContactMethod(response.contactMethod, true);
            promise.resolve();
        });

        return promise;
    };

    /**
     * Request server to delete a contact method
     *
     * @method loadAllData
     * @private
     * @param {int}     pk of the contact method to delete
     * @return {Array}  A promise for the returned data
     */
    SettingsController.prototype.removeContactMethod = function (pk) {
        var that = this,
            promise = $.Deferred(),
            request = $.ajax({
                dataType: 'JSON',
                type: "POST",
                url: "/rest/contactMethods",
                data: {
                    pk: pk,
                    subscribed: true
                }
            }).fail(that.failMessage);

        $.when(request).done(function (response) {
            that.updateContactMethod(response.contactMethod, false);
            promise.resolve();
        });

        return promise;
    };

    /**
     * Returns the contact methods cached by the controller
     *
     * @method getContactMethods
     * @private
     * @return {Object} attributes  pk : contact method object
     */
    SettingsController.prototype.getContactMethods = function () {
        return this.contactMethods;
    };

    /**
     * Returns the categories cached by the controller
     *
     * @method getCategories
     * @private
     * @return {Object} attributes  pk : category object
     */
    SettingsController.prototype.getCategories = function () {
    	return this.categories;
    };

    /**
     * Returns the subscriptions cached by the controller
     *
     * @method getSubscriptions
     * @private
     * @return {Object} attributes  pk : subscription object
     */
    SettingsController.prototype.getSubscriptions = function () {
        return this.subscriptions;
    };

    /**
     * Returns the providers cached by the controller
     *
     * @method getProviders
     * @private
     * @return {Object} attributes  pk : provider object
     */
    SettingsController.prototype.getProviders = function () {
        return this.providers;
    };

    return SettingsController;
});