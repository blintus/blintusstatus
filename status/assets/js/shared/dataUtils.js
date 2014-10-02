/**
 * @class shared.DataUtils
 * @static
 */
define([], function () {

    return {

        /**
         * Convert an array of data to a primary key object.
         *
         * Ex:
         * <pre><code>[
         *     {
         *         pk: 1,
         *         data1: 'value'
         *     }
         * ]
         * </code></pre>
         * becomes
         * <pre><code>{
         *     1: {
         *         pk: 1,
         *         data1: 'value'
         *     }
         * }
         * </code></pre>
         *
         * @method arrayToPkObject
         * @param {Array} dataArray The array of data to convert
         * @return {Object} The converted object
         */
        arrayToPkObject: function (dataArray) {
            var stack = (new Error()).stack;
            console.warn('This should be replaced with a call to _.indexBy(dataArray, \'pk\') at \n', stack);
            if (!Array.isArray(dataArray)) {
                throw new Error('arrayToPkObject takes an array as an argument.');
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
            var stack = (new Error()).stack;
            console.warn('This should be replaced with a call to _.cloneDeep(data) or _.clone(data) at \n', stack);
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