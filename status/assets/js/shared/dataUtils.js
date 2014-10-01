define([], function () {

    return {

        arrayToPkObject: function (dataArray) {
            var obj = {};
            dataArray.forEach(function (data) {
                obj[data.pk] = data;
            });
            return obj;
        }

    };

});