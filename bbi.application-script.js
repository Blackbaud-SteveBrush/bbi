/*! BBI Application Script Handler (c) Blackbaud, Inc. */
(function(_win, bbi) {
    "use strict";



    /**
     * The _Script object looks for special tags on the page that have the attribute 'data-bbi-src'.
     * It then loads each of these scripts dynamically on the page, and lets BBI know when they've been loaded.
     **/



    var alias = "applications-script-handler";



    bbi.on("init", function () {



        bbi.extension({
            alias: alias,
            defaults: {
                dataAttr_script: 'data-bbi-src'
            },
            directive: function (ext, bbi, $) {



                var _settings = ext.settings();
                var _scripts = [];
                var _done = false;
                var _onDone = [];



                var methods = {
                    done: function () {
                        _done = true;
                        for (var i = 0, len = _onDone.length; i < len; i++) {
                            _onDone[i].call({}, {scripts: methods.getScripts});
                        }
                    },
                    find: function() {
                        var scripts = $('[' + _settings.dataAttr_script + '], [bbi-src]');
                        var length = scripts.length;
                        if (bbi.isDebugMode() === true) {
                            bbi.log(length + " application tags found.", false);
                        }
                        var i;
                        if (length > 0) {
                            for (i = 0; i < length; i++) {
                                methods.process(scripts[i]);
                            }
                        }
                    },
                    getScripts: function() {
                        return _scripts;
                    },
                    isUnique: function(src) {
                        for (var i = 0, len = _scripts.length; i < len; i++) {
                            if (_scripts[i].src === src) {
                                return false;
                            }
                        }
                        // Check if there's another script with the same source attribute.
                        // We don't want to load duplicates of the same file.
                        return true;
                    },
                    process: function(elem) {
                        var script = {
                            src: elem.getAttribute(_settings.dataAttr_script) || elem.getAttribute('bbi-src')
                        };
                        if (script.src && methods.isUnique(script.src)) {
                            _scripts.push(script);
                            bbi.helper.loadScript(script.src);
                        }
                    }
                };



                var __construct = (function() {
                    $(_win.document).on('bbi-ready', function() {
                        $(function () {
                            methods.find();
                            methods.done();
                        });
                    });
                }());



                return {
                    done: function (callback) {
                        if (_done) {
                            callback.call({}, {scripts: methods.getScripts});
                        } else {
                            _onDone.push(callback);
                        }
                    },
                    scripts: methods.getScripts
                };



            }
        });



        var instance = bbi.instantiate(alias);



    });



}.call({}, window, bbiGetInstance()));
