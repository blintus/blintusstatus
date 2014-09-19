
var routes = [
    [/^profile\/(\d+)/, 'pages/profile'],
    [/^(.*)$/, 'pages/home']
];

requirejs.config({
    baseUrl: ASSET_ROOT + 'js/lib',
    paths: {
        'pages': '../pages'
    }
});

define('jquery', [], function () {
    return jQuery;
});

var pathArgs;
define('pathArgs', [], function () {
    return pathArgs;
});

var loadPage = function () {
    var pathname = window.location.pathname;
    if (pathname.indexOf('/') === 0) pathname = pathname.substring(1);
    routes.forEach(function (routePath) {
        var route = routePath[0];
        var path = routePath[1];
        if (route.test(pathname)) {
            var results = route.exec(pathname);
            pathArgs = results.slice(1).filter(function (item) {
                return item !== '';
            });
            require([path]);
        }
    });
};

loadPage();