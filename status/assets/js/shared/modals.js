define(['lodash', 'hbs!shared/modalMarkup'], function (_, modalMarkup) {

    /*********************************
     ** Internal modal helper class **
     *********************************/

    var _Modal = function (options) {
        _.defaults(options, {
            closeable: true,
            title: '',
            body: '',
            cancelable: true,
            cancelBtn: 'Cancel',
            okBtn: 'OK',
            show: false,
            okCallback: _.noop
        });
        this._modal = $(modalMarkup({
            closeable: options.closeable,
            title: options.title,
            body: options.body,
            cancelable: options.cancelable,
            cancelBtn: options.cancelBtn,
            okBtn: options.okBtn
        }));
        this._modal.modal({
            backdrop: options.closeable ? true : 'static',
            keyboard: options.closeable,
            show: options.show
        });
        this._modal.find('.okBtn').on('click', options.okCallback);
        $('body').append(this._modal);
    };

    _Modal.prototype.show = function () {
        this._modal.modal('show');
    };

    _Modal.prototype.hide = function () {
        this._modal.modal('hide');
    };

    _Modal.prototype.find = function (selector) {
        return this._modal.find(selector);
    };

    _Modal.prototype.on = function (eventNames, callback) {
        this._modal.on(eventNames, callback);
        return this;
    };

    _Modal.prototype.destroy = function () {
        this._modal.remove();
    };


    /**
     * Creates and shows a new message modal with the specified settings,
     * and removes it from the dom when it is closed.
     *
     * <pre><code>Options
     *
     * title: The modal title
     * body:  The modal body
     * </code></pre>
     *
     * @class shared.modals.MessageModal
     * @constructor
     * @param {Object} options The options
     */
    var MessageModal = function (options) {
        var that = this;
        this._modal = new _Modal({
            title: options.title,
            body: options.body,
            cancelable: false,
            show: true,
            okCallback: function (event) {
                that._modal.hide();
            }
        });
        this._modal.on('hidden.bs.modal', function (event) {
            that._modal.destroy();
        }).on('shown.bs.modal', function (event) {
            $(event.target).find('.okBtn').focus();
        });
    };


    /**
     * Creates and shows a new confirm modal with the specified settings,
     * and removes it from the dom when it is closed.
     *
     * <pre><code>Options
     *
     * title:      The modal title
     * body:       The modal body
     * cancenBtn:  The text for the cancel button, defaults to 'Cancel'
     * okBtn:      The text for the ok button, defaults to 'OK'
     * okCallback: The method called if the user confirms
     * </code></pre>
     *
     * @class shared.modals.ConfirmModal
     * @constructor
     * @param {Object} options The options
     */
    var ConfirmModal = function (options) {
        var that = this;
        this._modal = new _Modal({
            title: options.title,
            body: options.body,
            cancelBtn: options.cancelBtn,
            okBtn: options.okBtn,
            cancelable: true,
            show: true,
            okCallback: function (event) {
                options.okCallback();
                that._modal.hide();
            }
        });
        this._modal.on('hidden.bs.modal', function (event) {
            that._modal.destroy();
        });
    };


    /**
     * Creates a new form modal, but doesn't show it. This modal is not
     * automatically removed from the dom, and is meant to be reused.
     *
     * <pre><code>Options
     *
     * title:          The title of the dialog
     * body:           The body of the modal, typically the html for the form
     * cancelBtn:      The text for the cancel button
     * okBtn:          The text for the ok button
     * submitCallback: The function to call after the user submits the form. This
     *                 gets called with an object containing field names as keys,
     *                 and values as the values.
     * </code></pre>
     *
     * @class shared.modals.FormModal
     * @constructor
     * @param {Object} options The options
     */
    var FormModal = function (options) {
        var that = this;
        this._modal = new _Modal({
            title: options.title,
            body: options.body,
            cancelBtn: options.cancelBtn,
            okBtn: options.okBtn,
            okCallback: function (event) {
                if (options.submitCallback) {
                    options.submitCallback(that._getFormData());
                }
                that.hide();
            }
        });
        this._forms = this._modal.find('form');
    };

    /**
     * Show the form modal.
     *
     * @method show
     */
    FormModal.prototype.show = function () {
        this._modal.show();
        return this;
    };

    /**
     * Hide the form modal.
     *
     * @method hide
     */
    FormModal.prototype.hide = function () {
        this._modal.hide();
        return this;
    };

    /**
     * Reset all forms in the modal.
     *
     * @method reset
     */
    FormModal.prototype.reset = function () {
        this._forms.each(function (i, form) {
            form.reset();
        });
        return this;
    };

    /**
     * Get the form data for all forms in the modal.
     *
     * @method _getFormData
     * @private
     * @return {Object} The name: value mappings for all fields in the form
     */
    FormModal.prototype._getFormData = function () {
        var formData = {};
        this._forms.each(function (i, form) {
            $(form).find(':input').each(function (i2, input) {
                var value = input.value;
                if (input.type === 'checkbox') {
                    value = input.checked;
                }
                formData[input.name] = value;
            });
        });
        return formData;
    };


    return {
        MessageModal: MessageModal,
        FormModal: FormModal
    };

});