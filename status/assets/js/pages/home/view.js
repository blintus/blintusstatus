define(['jquery', 'hbs!pages/home/markup'], function ($, markup) {
    'use strict';

    var HomeView = function ($container) {
        $container.append(markup());
    };

    return HomeView;

});