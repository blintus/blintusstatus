define(['pageUtils', 
		'pages/settings/view'
	], function (pageUtils, SettingsView) {
    
    'use strict';


    var SettingsController = function (store, $container) {
        this.view = new SettingsView(store, this, $container);
        this.store = store;
        pageUtils.setTitle("Settings");
        //this.loadAllData();
    };

    return SettingsController;

});