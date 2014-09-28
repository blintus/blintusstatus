define(['jquery', 
		'hbs!pages/settings/markup'
	], function ($, pageMarkup) {
    
    'use strict';

    /**
     * Constructor for a settings view
     *
     * @class SettingsView
     * @constructor
     * @param {Store} store The store for the app
     * @param {jQuery} $container A jQuery object for the root content container
     */
    var SettingsView = function (store, controller, $container) {
        this.store = store;
        this.controller = controller;
        $container.append(pageMarkup());
    };

    /**
     * Initializes the view with data
     *
     * @method init
     */
    HomeView.prototype.init = function () {
        this._initEventListeners();
    };

    /**
     * Initializes the event listeners for the view
     *
     * @method _initEventListeners
     * @private
     */
    HomeView.prototype._initEventListeners = function () {
        var that = this;

        // Bind listeners
        this.categoryLinks.on('click', function (event) {

        });
    };

    return SettingsView;

});