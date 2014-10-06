define(['jquery', 'lodash', 'persistentStorage',
    'hbs!pages/home/markup',
    'hbs!pages/home/markup/statusPost',
    'hbs!pages/home/markup/categoryTemplate',
    'hbs!pages/home/markup/comment'
], function ($, _, persistentStorage, pageMarkup, postMarkup, categoryMarkup, commentMarkup) {
    'use strict';

    var animationSettings = {
        duration: 200,
        queue: true
    };

    /**
     * Constructor for a home view
     *
     * @class pages.home.HomeView
     * @constructor
     * @param {jQuery} $container A jQuery object for the root content container
     */
    var HomeView = function (controller, $container) {
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
            categories = this.controller.getRootCategories();

        this.$categoriesList.empty().append(categoryMarkup({
            categories: categories
        }));
        this.categoryLinks = $('.category-link');

        var selectedCategoryId = persistentStorage.getItem('local', 'selectedCategoryId');
        if (!this.controller.getCategory(selectedCategoryId)) {
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

        // Bind post comment buttons
        this.$postContainer.on('click', '.post-comment-btn', function (event) {
            var $target = $(event.target);
            var postId = $target.data('postid');
            that._addComment($target, postId);
        });

    };

    /**
     * Select a category and display the related posts
     *
     * @method _selectCategory
     * @private
     * @param {int} categoryId The id of the category to select
     * @param {jQuery} [$targetCategoryLink] An optional parameter that specifies the category
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

        posts = _.cloneDeep(this.controller.getPostsForCategory(categoryId));

        // Add categories to post, and render them
        _.each(posts, function (post) {
            post.category = that.controller.getCategory(post.category);
        });
        this.$postContainer.empty().append(postMarkup({
            posts: posts
        }));

    };

    /**
     * Show comments for the specified post
     *
     * @param {jQuery} $showLink An object representing the link that was clicked
     * @param {int} postId The post to show comments for
     */
    HomeView.prototype._showComments = function ($showLink, postId) {
        $showLink.slideUp(animationSettings);
        var $commentsSpinner = $showLink.siblings('.comments-spinner');
        $commentsSpinner.slideDown(animationSettings);
        $.when(this.controller.getCommentsForPost(postId)).done(function (comments) {
            var $commentsContainer = $showLink.siblings('.comments');
            var commentsList = [];
            _.each(comments, function (comment) {
                commentsList.push(commentMarkup(comment));
            });
            $commentsContainer.find('.comments-inner').append(commentsList.join(''));
            $commentsSpinner.slideUp(animationSettings);
            $commentsContainer.slideDown(animationSettings);
        });
    };

    HomeView.prototype._addComment = function ($postBtn, postId) {
        var $commentsList = $postBtn.parent().siblings('.comments-inner');
        var $messageBox = $postBtn.siblings('textarea');
        var $savingSpinner = $postBtn.siblings('.comments-textarea-spinner');
        var message = $messageBox.val();
        if (message === '') return;
        $messageBox.prop('disabled', true);
        $postBtn.prop('disabled', true);
        $savingSpinner.show();
        $.when(this.controller.addComment(postId, message)).done(function (comment) {
            $commentsList.append(commentMarkup(comment));
            $messageBox.val('');
            $messageBox.prop('disabled', false);
            $postBtn.prop('disabled', false);
            $savingSpinner.hide();
        });
    };

    return HomeView;

});