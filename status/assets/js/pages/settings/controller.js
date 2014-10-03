define(['pageUtils', 
		'pages/settings/view'
	], function (pageUtils, SettingsView) {
    
    'use strict';


    var SettingsController = function ($container) {
        this.view = new SettingsView(this, $container);
        pageUtils.setTitle("Settings");
        this.loadAllData();
        this.subscriptions = null;
        this.contactMethods = null;
        this.providers = null;
        this.categories = null;
    };

    /**
     * Load all data from the server
     *
     * @method loadAllData
     */
    SettingsController.prototype.loadAllData = function () {
        var that = this,
            cat_promise,
            con_promise,
            prov_promise,
            sub_promise;

        cat_promise  = that.loadCategories();
        con_promise  = that.loadContactMethods();
        prov_promise = that.loadProviders();
        sub_promise  = that.loadSubscriptions();

        $.when(cat_promise, con_promise, prov_promise, sub_promise).done(function () {
            that.view.init();
        });
    };

    SettingsController.prototype.loadCategories = function () {
        var that = this;
        return $.getJSON("/rest/categories", function (json) {
            that.categories = _.indexBy(json, 'pk');
        });
    };

    SettingsController.prototype.loadContactMethods = function () {
        var that = this;
        return $.getJSON("/rest/contactMethods", function (json) {
            that.contactMethods = _.indexBy(json, 'pk');
        });
    };

    SettingsController.prototype.loadProviders = function () {
        var that = this;
        return $.getJSON( "/rest/providers", function (json) {
            that.providers = _.indexBy(json, 'pk');
        });
    };

    SettingsController.prototype.loadSubscriptions = function () {
        var that = this;
        return $.getJSON("/rest/subscriptions", function ( json ) {
            that.subscriptions = _.indexBy(json, 'pk');
        });
    };

    SettingsController.prototype.getContactMethods = function () {
        var that = this,
            rawContactMethods = $.extend(true, {}, that.contactMethods);
        for (var key in rawContactMethods) {
            var provider = that.providers[rawContactMethods[key].provider];
            if (typeof provider !== 'undefined' && provider.name !== null) {
                rawContactMethods[key].provider = provider.name;
            }
        }
    	return rawContactMethods;
    };

    SettingsController.prototype.getCategories = function () {
    	return this.categories;
    };

    SettingsController.prototype.getSubscriptions = function () {
        return this.subscriptions;
    };

    SettingsController.prototype.getProviders = function () {
        return this.providers;
    };

    return SettingsController;

});