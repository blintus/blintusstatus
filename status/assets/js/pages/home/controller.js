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
     * @class HomeController
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
            that._posts = posts;
            that._categories = categories;

            // Created an object with child categories added to a children array
            var rawCategories = $.extend(true, {}, dataUtils.arrayToPkObject(categories));
            for (var key in rawCategories) {
                var category = rawCategories[key];
                if (category.parent) {
                    var parent = rawCategories[category.parent];
                    if (!parent.children) parent.children = [];
                    parent.children.push(category);
                }
            }

            var categoriesWithChildren = [];
            var nestedCategories = [];
            for (var key in rawCategories) {
                categoriesWithChildren.push(rawCategories[key]);
                if (!rawCategories[key].parent) {
                    nestedCategories.push(rawCategories[key]);
                }
            }
            that._categoriesWithChildren = categoriesWithChildren;
            that._nestedCategories = nestedCategories;

            that.view.init();
        });
    };

    /**
     * Helper method to get the ids of all nested categories
     *
     * @method _getChildrenCategoryIds
     * @private
     * @param {Array} children An array of children to search
     */
    HomeController.prototype._getChildrenCategoryIds = function (children) {
        var that = this,
            nestedIds = [];
        children.forEach(function (child) {
            nestedIds.push(child.pk);
            if (child.children) {
                Array.prototype.push.apply(nestedIds, that._getChildrenCategoryIds(child.children));
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
        // If a categoryId is specified, search for all posts with in that category or its children
        if (categoryId) {
            var categoryIds = this._getChildrenCategoryIds([dataUtils.arrayToPkObject(this._categoriesWithChildren)[categoryId]]);
            return this._posts.filter(function (post) {
                if (categoryIds.indexOf(post.category) === -1) {
                    // debugger
                }
                return categoryIds.indexOf(post.category) !== -1;
            });
        }
        return $.extend(true, [], this._posts);
    };

    HomeController.prototype.getComments = function (postId) {
        return commentsMock[postId];
    };

    return HomeController;

});