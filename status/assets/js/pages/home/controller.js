define(['pageUtils', 'pages/home/view'], function (pageUtils, HomeView) {
    'use strict';

    var HomeController = function () {
        this.view = null;
    }

    HomeController.prototype.start = function ($container) {
        pageUtils.setTitle("Home");
        this.view = new HomeView($container);
    };

    return HomeController;

});