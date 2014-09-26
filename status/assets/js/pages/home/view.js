define(['jquery',
    'hbs!pages/home/markup',
    'hbs!pages/home/statusPostMarkup',
    'hbs!pages/home/categoryTemplate'
], function ($, pageMarkup, postMarkup, categoryMarkup) {
    'use strict';

    /**
     * Constructor for a home view
     *
     * @class
     * @constructor
     * @param {Store} store The store for the app
     * @param {jQuery} $container A jQuery object for the root content container
     */
    var HomeView = function (store, controller, $container) {
        this.store = store;
        this.controller = controller;
        $container.append(pageMarkup());
        this.$postContainer = $container.find("#status-posts");
        this.$categoriesList = $container.find("#categories-list");
        this.categoryLinks = null;
    };

    /**
     * Initializes the view with data
     *
     * @method init
     */
    HomeView.prototype.init = function () {
        var that = this,
            categories = this.store.items('nestedCategories');

        this.$categoriesList.empty().append(categoryMarkup({
            categories: categories
        }));
        this.categoryLinks = $('.category-link');

        var selectedCategoryId = localStorage['selectedCategoryId'];
        if (!this.store.item('categories', selectedCategoryId)) {
            selectedCategoryId = categories[0].pk;
        }
        this._selectCategory(selectedCategoryId);

        this._initEventListeners();
    };

    /**
     * Initializes the event listeners for the view
     *
     * @method _initEventListeners
     * @private
     */
    HomeView.prototype._initEventListeners = function () {
        var that = this;

        // Bind category link listeners
        this.categoryLinks.on('click', function (event) {
            var $target = $(event.target);
            var categoryId = $target.data('categoryid');
            that._selectCategory(categoryId, $target);
        });

        // Bind post inline category link listeners
        this.$postContainer.on('click', '.inline-category-link', function (event) {
            var categoryId = $(event.target).data('categoryid');
            that._selectCategory(categoryId);
        });

    };

    /**
     * Select a category and display the related posts
     *
     * @method _selectCategory
     * @private
     * @param {int} categoryId The id of the category to select
     * @param {jQuery} $targetCategoryLink An optional parameter that specifies the category
                                           link that was clicked. If omitted, finds the link based
                                           on the categoryId
     */
    HomeView.prototype._selectCategory = function (categoryId, $targetCategoryLink) {
        var that = this,
            posts;

        localStorage['selectedCategoryId'] = categoryId;

        // Update link css classes
        this.categoryLinks.removeClass('active');
        if ($targetCategoryLink) {
            $targetCategoryLink.addClass('active');
        } else {
            $('.category-link[data-categoryid="' + categoryId + '"]').addClass('active');
        }

        posts = this.controller.getPostsForCategory(categoryId);

        // Add categories to post, and render them
        posts.forEach(function (post) {
            post.category = that.store.item('categories', post.category);
        });
        this.$postContainer.empty().append(postMarkup({
            posts: posts
        }));

    };

    return HomeView;

});