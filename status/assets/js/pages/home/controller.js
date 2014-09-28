define(['pageUtils', 'pages/home/view',
    'pages/home/mocks/postsMock',
    'pages/home/mocks/categoriesMock',
], function (pageUtils, HomeView, postsMock, categoriesMock) {
    'use strict';

    /**
     * Constructor for a home controller
     *
     * @class HomeController
     * @contructor
     * @param {Store} store The store for the app
     * @param {jQuery} $container A jQuery object for the root content container
     */
    var HomeController = function (store, $container) {
        this.view = new HomeView(store, this, $container);
        this.store = store;
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
            that.store.addAll('posts', posts);
            that.store.addAll('categories', categories);

            // Created an object with child categories added to a children array
            var rawCategories = $.extend(true, {}, that.store.itemsRaw('categories'));
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
            that.store.addAll('categoriesWithChildren', categoriesWithChildren);
            that.store.addAll('nestedCategories', nestedCategories);

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
        var categories = this.store.itemsRaw('categoriesWithChildren');
        // If a categoryId is specified, search for all posts with in that category or its children
        if (categoryId) {
            var categoryIds = this._getChildrenCategoryIds([categories[categoryId]]);
            return $.extend(true, [], this.store.query('posts', function (post) {
                return categoryIds.indexOf(post.category) !== -1;
            }));
        }
        return $.extend(true, [], this.store.items('posts'));
    };

    return HomeController;

});