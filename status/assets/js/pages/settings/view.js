define(['jquery', 'hbs!pages/settings/markup'], function ($, markup) {
    'use strict';

    var SettingsView = function ($container) {
        $container.append(markup());
    };

    return SettingsView;

});