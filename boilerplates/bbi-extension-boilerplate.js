(function(alias, bbi) {
    "use strict";

    bbi.on("preload", function () {});

    bbi.on("init", function () {
        bbi.extension({
            alias: alias,
            defaults: {},
            directive: function (ext, bbi, $) {
                var settings = ext.settings();
                var methods = {};
                var __construct = (function () {
                }());
                return {
                    myMethod: function () {}
                };
            }
        });
        (function (instance) {
            bbi.map(alias, instance.myMethod.bind(instance));
        }(bbi.instantiate(alias)));
    });

    bbi.on("complete", function () {});

}.call({}, "slug", window.bbiGetInstance()));
