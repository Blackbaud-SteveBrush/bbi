/*! BBI Storage (c) Blackbaud, Inc. */
(function(_win, bbi) {
    "use strict";



    var alias = "storage";



    bbi.on("init", function() {



        bbi.extension({
            alias: alias,
            defaults: {},
            directive: function(ext, bbi, $) {

                var _x = {};

				var methods = {
					clear: function (key) {
						if (typeof key === "string") {
							delete _x[key];
						} else {
							_x = {};
						}
						methods.save();
					},
					expose: function () {
						return _x;
					},
					get: function (key) {
						if (typeof _x[key] === "undefined" || _x[key] === "undefined") {
							return null;
						} else {
							return _x[key];
						}
					},
					set: function (key, value) {
						_x[key] = value;
						methods.save();
					},
					objectToString: function (obj) {
						return JSON.stringify(obj);
					},
					stringToObject: function (str) {
						var temp;
						if (str === "undefined") {
							str = "null";
						}
	                    if (typeof JSON.parse === "function") {
		                    if (bbi.isDebugMode() === true) {
                                bbi.log("[BBI.storage] Parsing storage via JSON.parse.", false);
                            }
                            try {
                                temp = JSON.parse(str);
                            } catch (e) {
                                temp = {};
                                bbi.log("[BBI.Storage] JSON.parse ERROR: ", e);
                            }
	                    } else if (typeof $.parseJSON === "function") {
                            if (bbi.isDebugMode() === true) {
                                bbi.log("[BBI.storage] Parsing storage via $.parseJSON.", false);
                            }
                            temp = $.parseJSON(str);
                        } else {
                            if (bbi.isDebugMode() === true) {
                                bbi.log("[BBI.storage] Parsing storage via eval().", false);
                            }
                            temp = eval('(' + str + ')');
                        }
                        return temp;
					},
					load: function () {
						var ls = _win.sessionStorage;
						for (var k in ls) {
							if (typeof ls[k] === "string") {
								_x[k] = methods.stringToObject(ls[k]);
							}
						}
					},
					save: function () {
						var val;
						if (typeof _win.sessvars === "object") {
							return;
						}
						_win.sessionStorage.clear();
						for (var k in _x) {
							val = methods.objectToString(_x[k]);
							_win.sessionStorage.setItem(k, val);
						}
					}
				};

				var __construct = (function () {
					methods.load();
					_win.onunload = methods.save;
				}());

				return {
					clear: methods.clear,
					expose: methods.expose,
					get: methods.get,
					set: methods.set
				};
            }
        });



        var instance = bbi.instantiate(alias);



        bbi.map(alias, instance);



    });



}.call({}, window, bbiGetInstance()));
