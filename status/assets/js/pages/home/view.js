define(['jquery', 'persistentStorage',
    'hbs!pages/home/markup',
    'hbs!pages/home/statusPostMarkup',
    'hbs!pages/home/categoryTemplate',
    'hbs!pages/home/commentsMarkup'
], function ($, persistentStorage, pageMarkup, postMarkup, categoryMarkup, commentsMarkup) {
    'use strict';

    /**
     * Constructor for a home view
     *
     * @class HomeView
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

        var selectedCategoryId = persistentStorage.getItem('local', 'selectedCategoryId');
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

        // Bind show comments links
        this.$postContainer.on('click', '.comments-show-link', function (event) {
            var $target = $(event.target);
            var postId = $target.data('postid');
            that._showComments($target, postId);
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

        persistentStorage.setItem('local', 'selectedCategoryId', categoryId);

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

    HomeView.prototype._showComments = function ($showLink, postId) {
        var comments = this.controller.getComments(postId);
        var $commentsDiv = $showLink.siblings('.comments');
        $commentsDiv.prepend(commentsMarkup({
            comments: comments
        }));
        $commentsDiv.slideDown({
            duration: 200,
            queue: false
        });
        $showLink.slideUp({
            duration: 200,
            queue: false
        });
    };

    return HomeView;

});