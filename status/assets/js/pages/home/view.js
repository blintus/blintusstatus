define(['jquery',
    'hbs!pages/home/markup',
    'hbs!pages/home/statusPostMarkup'
], function ($, pageMarkup, postMarkup) {
    'use strict';

    var HomeView = function ($container) {
        $container.append(pageMarkup());
        this.$postContainer = $container.find("#status-posts");
    };

    HomeView.prototype.setPosts = function (posts) {
        this.$postContainer.empty().append(postMarkup({
            posts: posts
        }));
    };

    return HomeView;

});