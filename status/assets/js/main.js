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
            pages: '../pages'
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

    /************************
     ** Handlebars helpers **
     ************************/

    define('templates/helpers/statusIcon', ['hbs/handlebars'], function (Handlebars) {
        Handlebars.registerHelper('statusIcon', function (statusCode, options) {
            var iconClass = 'status-icon';
            if (options.hash.small) {
                iconClass += '-small';
            }
            statusCode = Handlebars.Utils.escapeExpression(statusCode);
            return new Handlebars.SafeString('<span class="' + iconClass + ' status-icon-status-' + statusCode + '"></span>');
        });
    });

    var padTime = function (str) {
        str = '' + str;
        var zeros = (str.length === 2) ? '' : ((str.length === 1) ? '0' : '00');
        return zeros + str;
    };

    define('templates/helpers/formatPostDate', ['hbs/handlebars'], function (Handlebars) {
        Handlebars.registerHelper('formatPostDate', function (dateStr) {
            var dateObj = new Date(dateStr);
            // var hours = padTime(dateObj.getHours());
            // var minutes = padTime(dateObj.getMinutes());
            // var seconds = padTime(dateObj.getSeconds());
            // var time = hours + ':' + minutes + ':' + seconds;
            var month = dateObj.getMonth();
            var day = dateObj.getDate();
            var year = dateObj.getFullYear();
            var date = month + '/' + day + '/' + year;
            return 'on ' + date;
        });
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