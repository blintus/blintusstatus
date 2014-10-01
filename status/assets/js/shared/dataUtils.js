/**
 * Utilities to help with the manipulation of data
 *
 * @module shared/dataUtils
 */
define([], function () {

    return {

        /**
         * Convert an array of data to a primary key object.
         *
         * Ex:
         * [
         *     {
         *         pk: 1,
         *         data1: 'value'
         *     }
         * ]
         * becomes
         * {
         *     1: {
         *         pk: 1,
         *         data1: 'value'
         *     }
         * }
         *
         * @method arrayToPkObject
         * @param {Array} dataArray The array of data to convert
         * @return {Object} The converted object
         */
        arrayToPkObject: function (dataArray) {
            if (!Array.isArray(dataArray)) {
                throw new Error('arrayToPkObject takes an array as an argument.')
            }
            var obj = {};
            dataArray.forEach(function (data) {
                obj[data.pk] = data;
            });
            return obj;
        },

        /**
         * Deep clone an object or array
         *
         * @method clone
         * @param {Object} data The object to clone
         * @return {Object} A copy of data
         */
        clone: function clone(data) {
            if (data === null || data === undefined) {
                return data;
            } else if (typeof data === 'object') {
                var objCopy = (Array.isArray(data)) ? [] : {};
                for (var key in data) {
                    if (typeof data[key] === 'object') {
                        objCopy[key] = clone(data[key]);
                    } else {
                        objCopy[key] = data[key];
                    }
                }
                return objCopy;
            } else {
                return data;
            }
        }

    };

});