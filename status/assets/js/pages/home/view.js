define(['jquery', 'shared/statusIcons',
    'hbs!pages/home/markup',
    'hbs!pages/home/statusPostMarkup'
], function ($, statusIcons, pageMarkup, postMarkup) {
    'use strict';

    var HomeView = function ($container) {
        $container.append(pageMarkup());
        this.$postContainer = $container.find("#status-posts");
    };

    HomeView.prototype.setPosts = function (posts) {
        posts.forEach(function (post) {
            post.statusIcon = statusIcons[post.status];
        });
        this.$postContainer.empty().append(postMarkup({
            posts: posts
        }));
    };

    return HomeView;

});