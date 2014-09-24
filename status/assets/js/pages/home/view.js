define(['jquery',
    'hbs!pages/home/markup',
    'hbs!pages/home/statusPostMarkup',
    'hbs!shared/categoryTemplate'
], function ($, pageMarkup, postMarkup, categoryMarkup) {
    'use strict';

    var HomeView = function ($container) {
        $container.append(pageMarkup());
        this.$postContainer = $container.find("#status-posts");
        this.$categoriesList = $container.find("#categories-list");
    };

    HomeView.prototype.setPosts = function (posts) {
        this.$postContainer.empty().append(postMarkup({
            posts: posts
        }));
    };

    HomeView.prototype.setCategories = function (categories) {
        this.$categoriesList.empty().append(categoryMarkup({
            categories: categories
        }));
    };

    return HomeView;

});