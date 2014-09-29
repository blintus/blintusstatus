define(['pageUtils', 
		'pages/settings/view',
		'pages/settings/mocks/contactMethodsMock',
		'pages/settings/mocks/subscriptionsMock',
		'pages/settings/mocks/providersMock',
		'pages/home/mocks/categoriesMock'
	], function (pageUtils, SettingsView, contactMethodsMock, subscriptionsMock, providersMock, categoriesMock) {
    
    'use strict';


    var SettingsController = function (store, $container) {
        this.view = new SettingsView(store, this, $container);
        this.store = store;
        pageUtils.setTitle("Settings");
        this.loadAllData();
    };

    /**
     * Load all data from the server
     *
     * @method loadAllData
     */
    SettingsController.prototype.loadAllData = function () {
        var that = this;

        $.when(contactMethodsMock, subscriptionsMock, providersMock, categoriesMock).done(function (contactMethodResponse, SubscriptionResponse, providerResponse, categoryResponse) {
            that.store.addAll('contactMethods', contactMethodResponse);
            that.store.addAll('subscriptions', SubscriptionResponse);
            that.store.addAll('providers', providerResponse);
            that.store.addAll('categories', categoryResponse['categories']);

            that.view.init();
        });
    };

    SettingsController.prototype.getContactMethods = function () {
    	var rawContactMethods = $.extend(true, {}, this.store.items('contactMethods'));
		for (var key in rawContactMethods) {
			var provider = this.store.item('providers', rawContactMethods[key]['provider']);
			if (provider != null && provider['name'] != null) {
				rawContactMethods[key]['provider'] = provider['name'];
			}
		}
    	return rawContactMethods;
    }

    SettingsController.prototype.getCategories = function () {
    	return this.store.items('categories');
    }

    return SettingsController;

});