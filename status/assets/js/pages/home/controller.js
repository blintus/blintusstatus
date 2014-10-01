define(['pageUtils', 'shared/dataUtils',
    'pages/home/view',
    'pages/home/mocks/postsMock',
    'pages/home/mocks/categoriesMock',
    'pages/home/mocks/commentsMock'
], function (pageUtils, dataUtils, HomeView, postsMock, categoriesMock, commentsMock) {
    'use strict';

    /**
     * Constructor for a home controller
     *
     * @class pages.home.HomeController
     * @contructor
     * @param {jQuery} $container A jQuery object for the root content container
     */
    var HomeController = function ($container) {
        this.view = new HomeView(this, $container);
        pageUtils.setTitle("Home");
        this.loadAllData();
    };

    /**
     * Load all data from the server
     *
     * @method loadAllData
     */
    HomeController.prototype.loadAllData = function () {
        var that = this;

        $.when(postsMock, categoriesMock).done(function (posts, categories) {
            // Normal posts array
            that._posts = posts;

            // Created an object with child categories added to a children array
            categories = dataUtils.arrayToPkObject(categories);
            for (var key in categories) {
                var category = categories[key];
                if (category.parent) {
                    var parent = categories[category.parent];
                    if (!parent.children) parent.children = [];
                    parent.children.push(category);
                }
            }

            // An array of categories with each category having a array of it's children,
            // if it has any
            that._categories = categories;

            that.view.init();
        });
    };

    /**
     * Helper method to get the ids of category, as well as any children categories
     * of that category.
     *
     * @method _getCategoryIds
     * @private
     * @param {Array/Object} children An array of children or object to search
     */
    HomeController.prototype._getCategoryIds = function getCategoryIds(children) {
        var that = this,
            nestedIds = [];
        if (!Array.isArray(children)) children = [children];
        children.forEach(function (child) {
            nestedIds.push(child.pk);
            if (child.children) {
                Array.prototype.push.apply(nestedIds, getCategoryIds(child.children));
            }
        });
        return nestedIds;
    };

    /**
     * Fetch the posts that belong to a category, as well as all posts belonging to child categories
     *
     * @method getPostsForCategory
     * @param {int} categoryId The categoryId of the root category
     * @return {Array} An array of the posts available that belong to the category and its children
     */
    HomeController.prototype.getPostsForCategory = function (categoryId) {
        var categoryIds = this._getCategoryIds(this._categories[categoryId]);
        return this._posts.filter(function (post) {
            return categoryIds.indexOf(post.category) !== -1;
        });
    };

    /**
     * Get a single category by its id
     *
     * @method getCategory
     * @param {int} categoryId The id of the category
     * @return {Object} The category or null
     */
    HomeController.prototype.getCategory = function (categoryId) {
        return this._categories[categoryId] || null;
    };

    /**
     * Get a list of root level categories with their children included
     *
     * @method getRootCategories
     * @return {Array} An array of root level categories
     */
    HomeController.prototype.getRootCategories = function () {
        var rootCategories = [];
        for (var key in this._categories) {
            var category = this._categories[key];
            if (!category.parent) rootCategories.push(category);
        }
        return rootCategories;
    };

    /**
     * Get all of the comments for a post
     *
     * @param {int} postId The post id
     * @return {Array} An array of comments
     */
    HomeController.prototype.getCommentsForPost = function (postId) {
        return commentsMock[postId];
    };

    return HomeController;

});