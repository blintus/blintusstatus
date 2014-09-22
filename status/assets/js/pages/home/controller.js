define(['pageUtils', 'pages/home/view'], function (pageUtils, HomeView) {
    'use strict';

    var HomeController = function () {
        this.view = null;
    };

    HomeController.prototype.start = function ($container) {
        pageUtils.setTitle("Home");
        this.view = new HomeView($container);
        this.loadAllData();
    };

    HomeController.prototype.loadAllData = function () {
        var that = this;

        $.when({
            posts: [
                {
                    created: '',
                    updated: '',
                    message: 'This is a test message.',
                    user: '1',
                    status: '1',
                    category: '1',
                    title: 'This is a test title',
                    comments: []
                },
                {
                    created: '',
                    updated: '',
                    message: 'This is a second test message.',
                    user: '1',
                    status: '2',
                    category: '1',
                    title: 'This is a second test title',
                    comments: []
                },
                {
                    created: '',
                    updated: '',
                    message: 'This is a third test message.',
                    user: '1',
                    status: '3',
                    category: '1',
                    title: 'This is a third test title',
                    comments: []
                }
            ]
        }).done(function (response) {
            that.view.setPosts(response.posts);
        });
    };

    return HomeController;

});