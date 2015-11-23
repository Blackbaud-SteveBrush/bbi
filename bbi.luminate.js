/*! BBI Luminate (c) Blackbaud, Inc. */
(function(_win, bbi) {
	"use strict";



	var alias = "luminate";



	bbi.on("init", function() {



		bbi.extension({
			alias: alias,
			defaults: {},
			directive: function (ext, bbi, $) {

				var settings = ext.settings();

				var _yahoo$;

				var methods = {
					yahoo: function (callback) {

						if (typeof _yahoo$ === "function") {
							callback(_yahoo$);
							return;
						}

						if (typeof _win.Y !== "undefined" && typeof _win.Y.use === "function") {
							_win.Y.use('jquery-ui', function (Y) {

								var j = bbi("jQuery").getInstance(0);
								_yahoo$ = jQuery;

								j.setLocation("window", _yahoo$);
								j.setLocation("luminate", _yahoo$);

								callback(_yahoo$);

								return;
							});
						}

						callback();

					}
				};

				var __construct = (function () {

				}());

				return {
					fetchYahoo: methods.yahoo
				};

			}
		});



		var instance = bbi.instantiate(alias);



	});



}.call({}, window, bbiGetInstance()));
