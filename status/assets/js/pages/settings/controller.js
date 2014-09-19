define(['pageUtils', 'pages/settings/view'], function (pageUtils, SettingsView) {
    'use strict';

    var SettingsController = function () {
        this.view = null;
    }

    SettingsController.prototype.start = function ($container) {
        pageUtils.setTitle("Settings");
        this.view = new SettingsView($container);
    };

    return SettingsController;

});