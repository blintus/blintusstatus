define(['pageUtils', 
		'pages/settings/view',
        'shared/dataUtils'
	], function (pageUtils, SettingsView, dataFormatter) {
    
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

        cat_promise = $.getJSON("/rest/categories", function (json) {
            that.categories = dataFormatter.arrayToPkObject(json);
        });

        con_promise = $.getJSON("/rest/contactMethods", function (json) {
            that.contactMethods = dataFormatter.arrayToPkObject(json);
        });

        prov_promise = $.getJSON( "/rest/providers", function (json) {
            that.providers = dataFormatter.arrayToPkObject(json);
        });

        sub_promise = $.getJSON("/rest/subscriptions", function ( json ) {
            that.subscriptions = dataFormatter.arrayToPkObject(json);
        });

        $.when(cat_promise, con_promise, prov_promise, sub_promise).done(function () {
            that.view.init();
        });
    };

    SettingsController.prototype.getContactMethods = function () {
        var rawContactMethods = $.extend(true, {}, this.contactMethods);
        for (var key in rawContactMethods) {
            var provider = this.providers[rawContactMethods[key].provider];
            if (provider != null && provider.name !== null) {
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

    return SettingsController;

});