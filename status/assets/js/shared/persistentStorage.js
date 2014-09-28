define([], function () {
    'use strict';

    var MockStorage = function () {
        this.data = {};
    };
    MockStorage.prototype.getItem = function (key) {
        return this.data[key] || null;
    };
    MockStorage.prototype.setItem = function (key, value) {
        this.data[key] = value;
    };

    var PersistentStore = function () {
        this.stores = {
            'local': window.localStorage || new MockStorage(),
            'session': window.sessionStorage || new MockStorage(),
            'temp': new MockStorage()
        };
    };

    PersistentStore.prototype.getItem = function (persistType, key) {
        if (this.stores[persistType]) {
            return this.stores[persistType].getItem(key);
        }
        return null;
    };

    PersistentStore.prototype.setItem = function (persistType, key, value) {
        if (this.stores[persistType]) {
            this.stores[persistType].setItem(key, value);
        }
    };

    return PersistentStore;

});