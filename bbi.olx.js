/*! BBI Online Express (c) Blackbaud, Inc. */
(function(_win, bbi) {
    "use strict";
    var alias = "online-express";
    bbi.on("init", function() {
        bbi.extension({
            alias: alias,
            defaults: {},
            directive: function(ext, bbi, $) {
                var settings = ext.settings();
                var _bbiReady = false;
                var _olxReady = false;
                var _bb$, _$btn, _$root, _updateForm;
                var _$doc = $(_win.document);
                var _on = {
                    init: [],
                    error: [],
                    validate: [],
                    fail: [],
                    submit: [],
                    success: [],
                    beforeUpdate: [],
                    afterUpdate: []
                };
                var _methods = {
                    attach: function(fn, args, context) {
                        $(function() {
                            $.proxy(fn, context)(args);
                        });
                        _methods.on("afterUpdate", function() {
                            $.proxy(fn, context)(args);
                        });
                    },
                    block: function() {
                        _$root.block({
                            message: "Processing",
                            css: {
                                padding: "10px",
                                border: "none",
                                fontSize: "16px",
                                backgroundColor: "#000",
                                borderRadius: "10px",
                                "-webkit-border-radius": "10px",
                                "-moz-border-radius": "10px",
                                opacity: 0.5,
                                color: "#fff"
                            },
                            overlayCSS: {
                                backgroundColor: "#fff",
                                opacity: 0.5
                            }
                        });
                    },
                    check: function() {
                        if (_bbiReady && _olxReady) {
                            _$doc.trigger("olx-ready");
                        }
                    },
                    on: function(when, fn) {
                        if (typeof _on[when] === "undefined") {
                            throw new Error('The Online Express event "' + when + '" does not exist.');
                        }
                        _on[when].push(fn);
                    },
                    overrides: function() {
                        var _html = "";
                        // Add our own validations object.
                        _win.BBOXSectionScripts.BBI_NAMESPACE = _win.BBOXSectionScripts.BBI_NAMESPACE || {};
                        _win.BBOXSectionScripts.BBI_NAMESPACE.presubmit = function() {
                            var form = {
                                block: _methods.block,
                                unblock: _methods.unblock
                            };
                            var status = true;
                            var validations = _on["validate"];
                            if (bbi.isDebugMode()) {
                                bbi.log("Online Express Form has been submitted. Validations in progress...", false);
                            }
                            for (var i = 0, len = validations.length; i < len; i++) {
                                if (validations[i].call(form, form) === false) {
                                    status = false;
                                    break;
                                }
                            }
                            if (bbi.isDebugMode()) {
                                bbi.log("Online Express validated? " + status, false);
                            }
                            return status;
                        };
                        // Hijack the HTML as it is returned from post-processing.
                        if (typeof _win.bbox === "object" && typeof _win.bbox.squirtMarkup === "function") {
                            _win.bboxOverrides = _win.bboxOverrides || {};
                            _win.bboxOverrides.handleSubmitCallbackOverride = function(html) {
                                _html = html;
                                var numErrors = $(html).find('.BBFormErrorItem').length;
                                var form = {
                                    block: _methods.block,
                                    update: _methods.triggerFormSubmitted
                                };
                                // Register the onUpdate functions.
                                _updateForm = function() {
                                    _methods.update(html);
                                };
                                // There are errors on the page.
                                if (numErrors > 0 && _on.fail.length) {
                                    _methods.trigger("fail", [form, html], form);
                                } else {
                                    _methods.triggerFormSubmitted();
                                }
                                // Update the form's HTML.
                                _win.bbox.squirtMarkup(html, true);
                            };
                        } else {
                            _methods.on("submit", function() {
                                _methods.triggerFormSubmitted();
                            });
                        }
                        // Hijack the submit button
                        _$btn.on("click", function() {
                            var form = {};
                            _methods.trigger("submit");
                            if ($('#divClientError').is(":visible")) {
                                _methods.trigger("error", [form, _html], form);
                            }
                        });
                    },
                    trigger: function(when, args, context) {
                        if (typeof context !== "object") {
                            context = {};
                        }
                        if (Object.prototype.toString.call(args) !== "[object Array]") {
                            args = [];
                        }
                        if (typeof _on[when] !== "undefined") {
                            var list = _on[when];
                            var length = list.length;
                            var i;
                            for (i = 0; i < length; i++) {
                                if (typeof list[i] === "function") {
                                    list[i].apply(context, args);
                                }
                            }
                        }
                    },
                    triggerFormSubmitted: function() {
                        _$doc.trigger("olx-form-submitted");
                    },
                    unblock: function() {
                        _$root.unblock();
                    },
                    update: function(html) {
                        var form = {
                            block: _methods.block,
                            update: _methods.triggerFormSubmitted
                        };
                        // Give OLX time to breathe.
                        _win.setTimeout(function() {
                            _methods.trigger("beforeUpdate", [form, html], form);
                            _$root.find('.bbi-olx-message').addClass('bbi-off');
                            _$root.find('.bbi-olx-form').removeClass('bbi-off');
                            if (typeof _bb$.fn.unblock === "function") {
                                _$root.unblock();
                            }
                            _methods.trigger("afterUpdate", [form, html], form);
                        }, 50);
                    }
                };
                var __construct = (function() {
                    // BBI ready.
                    _$doc.on("bbi-ready", function() {
                        _bbiReady = true;
                        _methods.check();
                    });
                    // OLX ready.
                    _$doc.on("olx-ready", function() {
                        _methods.overrides();
                    });
                    _$doc.off("olx-form-submitted").on("olx-form-submitted", function() {
                        if (typeof _updateForm === "function") {
                            _updateForm();
                        }
                        // Successful submission of the form.
                        bbi.helper.doOnFind('.BBFormConfirmation', function() {
                            var form = {
                                block: _methods.block,
                                update: _methods.triggerFormSubmitted
                            };
                            _methods.trigger("success", [form], form);
                        });
                    });
                    // OLX loaded.
                    _win.bboxShowFormComplete = function() {
                        // Get OLX's jQuery.
                        var j = bbi("jQuery").getInstance(0);
                        j.setLocation("olx", _win["bb$"]);
                        _bb$ = j.jQuery("olx");
                        // Set the root container.
                        _$root = _bb$('#bbox-root');
                        if (_$root.length === 0) {
                            _$root = _bb$('div[id^="bbox-root-"]');
                        }
                        // Hijack the submit button.
                        _$btn = _$root.find('.BBFormSubmitbutton');
                        _olxReady = true;
                        _methods.check();
                    };
                }());
                return {
                    attach: _methods.attach,
                    block: _methods.block,
                    on: function(when, fn) {
                        if (_olxReady) {
                            _methods.on(when, fn);
                        } else {
                            _$doc.on("olx-ready", function() {
                                _methods.on(when, fn);
                            });
                        }
                    },
                    unblock: _methods.unblock,
                    update: _methods.triggerFormSubmitted
                };
            }
        });
        var instance = bbi.instantiate(alias);
        bbi.map("olx", instance);
        if (bbi("bbnc").getInstance(0).usesMicrosoftAjax() === false) {
            bbi.map("attach", instance.attach, true);
        }
    });
}.call({}, window, bbiGetInstance()));
