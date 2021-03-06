/*****************
 ** Page routes **
 *****************/

var PAGE_ROUTES = [
    [/^$/, 'pages/home/controller'],
    [/^settings/, 'pages/settings/controller']
];

var SERVER_URLS = [
    /^404/,
    /^login/,
    /^register/,
    /^logout/
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

    define('lodash', [], function () {
        return _;
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

    var persistentStorage = null;
    define('persistentStorage', ['shared/persistentStorage'], function (PersistentStorage) {
        if (persistentStorage === null) {
            persistentStorage = new PersistentStorage();
        }
        return persistentStorage;
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

    // black magic (ok not really) helper method for using recursive partials
    define('templates/helpers/recursivePartial', ['hbs/handlebars'], function (Handlebars) {
        Handlebars.registerHelper('recursivePartial', function (template, contextHash) {
            var tpl = Handlebars.partials[template];
            if (!tpl) return "";
            if (contextHash.hash && !_.isUndefined(contextHash.hash.depth)) {
                contextHash.hash.depth++;
            }
            return new Handlebars.SafeString(tpl(contextHash.hash));
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

    var $contentElement = $('#content');
    var pageController;

    var unloadPage = function () {
        if (pageController && pageController.destroy) {
            pageController.destroy();
        }
        $contentElement.empty();
    };

    var loadPage = function () {
        var pathname = window.location.pathname;
        if (pathname.indexOf('/') === 0) pathname = pathname.substring(1);
        var pageFound = false;
        _.each(PAGE_ROUTES, function (routePath) {
            var route = routePath[0];
            var path = routePath[1];
            if (route.test(pathname)) {
                var results = route.exec(pathname);
                pathArgs = results.slice(1).filter(function (item) {
                    return item !== '';
                });
                require([path], function (Controller) {
                    pageController = new Controller($contentElement);
                });
                pageFound = true;
                return false; // exit iteration early
            }
        });
        if (!pageFound) {
            var serverRouteFound = false;
            _.each(SERVER_URLS, function (regex) {
                if (regex.test(pathname)) {
                    serverRouteFound = true;
                    return false; // exit iteration early
                }
            })
            if (!serverRouteFound) {
                window.location = '/404';
            }
        }
    };

    var changePage = function () {
        unloadPage();
        loadPage();
    };

    $(window).on('popstate', changePage);
    $(document).on('click', 'a:not([rel="new-page"])', function (event) {
        event.preventDefault();
        var href = event.target.href;
        if (href && href !== window.location.href) {
            window.history.pushState(null, '', href);
            changePage();
        }
    });
    loadPage();

})();