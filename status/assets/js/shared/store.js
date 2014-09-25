/**
 * Defines a data store
 *
 * @module store
 */
define([], function () {
    'use strict';

    // /**
    //  * Helper method to tell if two objects are equal.
    //  *
    //  * @method _isEqual
    //  * @private
    //  * @param {Object} obj1
    //  * @param {Object} obj2
    //  * @return {Boolean} True if they are equal, false if they are not.
    //  */
    // var _isEqual = function (obj1, obj2) {
    //     for (key in obj2) {
    //         if (!obj1[key]) return false;
    //     }
    //     for (key in obj1) {
    //         if (!obj2[key]) return false;
    //         if (typeof obj1[key] === 'object') {
    //             if (!_isEqual(obj1[key], obj2[key])) return false;
    //         } else {
    //             if (obj1[key] !== obj2[key]) return false;
    //         }
    //     }
    //     return true;
    // };

    /**
     * Represents a store of data.
     *
     * @class Store
     * @constructor
     */
    var Store = function () {
        this._subscribable = $(this);
        this._queryCache = {};
        this.data = {};
    };

    Store.prototype = {

        /**
         * Fired when object(s) are added to the store
         *
         * @event added
         * @param {String} type The type in the store the object(s) were added to
         * @param {Array} objects The objects that were added to the store
         */
        /**
         * Fired when an object is updated in the store
         *
         * @event updated
         * @param {String} type The type in the store of the updated object
         * @param {Object} objects The object that was updated in the store
         */
        /**
         * Fired when object(s) are removed from the store
         *
         * @event removed
         * @param {String} type The type in the store the object(s) were removed from
         * @param {Array} objects The objects that were removed from the store
         */


        /**
         * Add an object to the store under the given type.
         *
         * @method add
         * @param {String} type The type to add the object under
         * @param {Object} object The object to add
         * @return {Store} Itself, for chaining
         */
        add: function (type, object) {
            if (!this.data[type]) {
                this.data[type] = {};
            }
            this.data[type][object.pk] = object;
            this.invalidateCache(type);
            this.utils._trigger('added', [type, [object]]);
            return this;
        },

        /**
         * Add all objects in an array to the store under the given type.
         *
         * @method addAll
         * @param {String} type The type to add the objects under
         * @param {Array} objectArray The array of objects to add
         * @return {Store} Itself, for chaining
         */
        addAll: function (type, objectArray) {
            var that = this;
            objectArray.forEach(function (object) {
                that.add(type, object);
            });
            this.invalidateCache(type);
            this.utils._trigger('added', [type, objectArray]);
            return this;
        },

        /**
         * Get the item of the given type with the given primary key
         *
         * @method item
         * @param {String} type The type to look under
         * @param {int} pk The primary key to search for
         * @return {Object} The found item, or null if no item is found
         */
        item: function (type, pk) {
            return this.data[type] && this.data[type][pk] || null;
        },

        /**
         * Get all items of the given type
         *
         * @method items
         * @param {String} type The type to get items for
         * @return {Array} An array of all objects of the given type
         */
        items: function (type) {
            return this.data[type] || null;
        },

        /**
         * Update an item
         *
         * @method update
         * @param {String} type The type of the object to update
         * @param {int} pk The primary key of the object to update
         * @param {Object} updateObject An object containing key value pairs to update
         * @return {Store} Itself, for chaining
         */
        update: function (type, pk, updateObject) {
            if (this.data[type] && this.data[type][pk]) {
                var object = this.data[type][pk];
                var changed = false;
                for (var field in updateObject) {
                    if (object[field] && object[field] !== updateObject[field]) {
                        object[field] = updateObject[field];
                        changed = true;
                    }
                }
                if (changed) this.invalidateCache(type);
            }
            this.utils._trigger('updated', [type, updateObject]);
            return this;
        },

        /**
         * Remove an object from the store
         *
         * @method remove
         * @param {String} type The type of the object to remove
         * @param {int} pk The primary key of the object to remove
         * @return {Store} Itself, for chaining
         */
        remove: function (type, pk) {
            var delObj = null;
            if (this.data[type] && this.data[type][pk]) {
                delObj = this.data[type][pk];
                delete this.data[type][pk];
            }
            this.utils._trigger('removed', [type, [delObj]]);
            return this;
        },

        /**
         * Remove all objects of a given type from the store
         *
         * @method removeAll
         * @param  {String} type The type of the objects to remove
         * @return {Store} Itself, for chaining
         */
        removeAll: function (type) {
            var removedObjects = [];
            if (this.data[type]) {
                for (pk in this.data[type]) {
                    removedObjects.push(this.data[type][pk]);
                    delete this.data[type][pk];
                }
            }
            this.utils._trigger('removed', [type, removedObjects]);
            return this;
        },

        /**
         * Bind an event handler to the store.
         *
         * @method on
         * @param {String} eventNames The event names to bind to, separated by spaces
         * @param {Function} callback
         * @return {Store} Itself, for chaining
         */
        on: function (eventNames, callback) {
            this._subscribable.on(eventNames, callback);
        },

        /**
         * Remove all or a specific bound handler from the given events.
         *
         * @method off
         * @param {String} eventNames The event names to unbind from, separated by spaces
         * @param {Fucntion} [callback] If specified, only removes that specific callback
         * @return {Store} Itself, for chaining
         */
        off: function (eventNames, callback) {
            this._subscribable.off(eventNames, callback);
        },

        /**
         * Query the store for objects.
         *
         * @method query
         * @param {String} type The store type to search under
         * @param {Object} filterObject An object of key value pairs to match when searching
         * @return {Array} An array of matched objects
         */
        query: function (type, filterObject) {
            var resultSet = [];
            var items = this.items(type);
            for (key in items) {
                var item = items[key];
                for (field in filterObject) {
                    if (item[field] && item[field] === filterObject[field]) {
                        resultSet.append(item);
                    }
                }
            }
            return resultSet;
        },

        utils: {

            // /**
            //  * Store/retrieve data to/from the query cache
            //  *
            //  * @method _qeuryCache
            //  * @private
            //  * @param {String} type The store type to associate with the cache
            //  * @param {String} key The cache key
            //  * @param {Object} [object] The object to save. If omitted, returns the data stored
            //                            in the cache for that key, or null if no data is stored
            //  * @return {Object} The data that was stored to/retrieved from the cache
            //  */
            // _queryCache: function (type, key, object) {},

            /**
             * Trigger an event listener.
             *
             * @method _trigger
             * @private
             * @param {String} eventName The event to trigger
             * @param {Array} extraArguments An array of arguments to pass to the handler
             * @return {Object} The return value of the last handler executed
             */
            _trigger: function (eventName, extraArguments) {
                return this._subscribable.triggerHandler(eventName, extraArguments);
            }

        }

    };

    return Store;

});