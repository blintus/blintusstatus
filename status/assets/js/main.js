/*****************
 ** Page routes **
 *****************/

var PAGE_ROUTES = [
    [/^$/, 'pages/home/controller'],
    [/^settings/, 'pages/settings/controller']
];

(function () {

    /*****************************
     ** RequireJS configuration **
     *****************************/

    requirejs.config({
        baseUrl: ASSET_ROOT + 'js/lib',
        paths: {
            hbs: 'require-handlebars-plugin/hbs',
            pages: '../pages',
            shared: '../shared'
        }
    });

    /*************************
     ** RequireJS utilities **
     *************************/

    define('jquery', [], function () {
        return jQuery;
    });

    var pathArgs;
    define('pathArgs', [], function () {
        return pathArgs;
    });

    define('pageUtils', ['jquery'], function ($) {
        return {
            setTitle: function (title) {
                document.title = "Blintus Status | " + title;
                $("#page-title").text(title);
            }
        };
    });

    /*****************************
     ** Global page setup stuff **
     *****************************/

    $('.redirect-form').on('submit', function (event) {
        event.target.action += "?next=" + window.location.pathname;
    });

    $('#logout-link').on('click', function (event) {
        event.target.href += "?next=" + window.location.pathname;
    });

    /**************************
     ** Page loading methods **
     **************************/

    var contentElement = $('#content');
    var pageController;

    var unloadPage = function () {
        if (pageController && pageController.destroy) {
            pageController.destroy();
        }
        contentElement.empty();
    };

    var loadPage = function () {
        var pathname = window.location.pathname;
        if (pathname.indexOf('/') === 0) pathname = pathname.substring(1);
        PAGE_ROUTES.forEach(function (routePath) {
            var route = routePath[0];
            var path = routePath[1];
            if (route.test(pathname)) {
                var results = route.exec(pathname);
                pathArgs = results.slice(1).filter(function (item) {
                    return item !== '';
                });
                require([path], function (Controller) {
                    pageController = new Controller();
                    if (pageController.start) {
                        pageController.start(contentElement);
                    } else {
                        throw new Error("Please define a start method in your controller.");
                    }
                });
            }
        });
    };

    var changePage = function () {
        unloadPage();
        loadPage();
    };

    $(window).on('popstate', changePage);
    $(document).on('click', 'a:not([rel="new-page"])', function (event) {
        event.preventDefault();
        var href = event.target.href;
        if (window.location.href !== href) {
            window.history.pushState(null, '', href);
            changePage();
        }
    });
    loadPage();

})();