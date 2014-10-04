define(['lodash'], function (_) {
    'use strict';

    /**
     * @class shared.Utils
     * @static
     */
    return {

        categories: {

            /**
             * Adds children to a categories primary key object.
             *
             * For example,
             * <pre><code>
             * {
             *     1: {
             *         pk: 1,
             *         name: 'Category 1',
             *         parent: null,
             *     },
             *     2: {
             *         pk: 2,
             *         name: 'Category 2',
             *         parent: 1
             *     }
             * }
             * </code></pre>
             * becomes
             * <pre><code>
             * {
             *     1: {
             *         pk: 1,
             *         name: 'Category 1',
             *         parent: null,
             *         children: [{
             *             pk: 2,
             *             name: 'Category 2',
             *             parent: 1
             *         }]
             *     },
             *     2: {
             *         pk: 2,
             *         name: 'Category 2',
             *         parent: 1
             *     }
             * }
             * </code></pre>
             *
             * @method addChildren
             * @param {Object} categories The categories primary key object to modify
             */
            addChildren: function (categories) {
                 _.each(categories, function (category) {
                    if (category.parent) {
                        var parent = categories[category.parent];
                        if (!parent.children) parent.children = [];
                        parent.children.push(category);
                    }
                });
            }

        }

    };

});