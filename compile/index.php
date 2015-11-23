<?php
error_reporting(E_ALL);
ini_set("display_errors", "1");
set_time_limit( 120 );

$version = dirname(__FILE__);
$version = explode("/compile", $version);
$version = $version[0];
$version = explode("v/", $version);
$version = $version[1];

$url = "http://closure-compiler.appspot.com/compile";

$files = array(
	"bbi.functions.js",
	"bbi.core.js",
	"bbi.extension.js",
	"bbi.jquery.js",
	"bbi.helper.js",
	"bbi.debug.js",
	"bbi.events.js",
	"bbi.storage.js",
	"bbi.bbnc.js",
	"bbi.luminate.js",
	"bbi.olx.js",
	"bbi.assets.js",
	"bbi.application.js",
	"bbi.applications.js",
	"bbi.application-script.js",
	"bbi.application-tag.js",
	"bbi.init.js"
);

$code = "";

//$mode = "WHITESPACE_ONLY";
$mode = "SIMPLE_OPTIMIZATIONS";
//$mode = "ADVANCED_OPTIMIZATIONS";
/*
$code .= "/*! ADD VERSION NUMBER TO DEFAULTS. \n(function ($,e,a) {
    $ && $(document).on(e, function(e, bbi, $) {
        bbi.on(a, function () {
            bbi.defaults('version', '" . $version . "');
        });
    });
}(window.jQuery, 'bbi-extension-service', 'preload'));\n\n\n\n";
*/
$code .= "(function (BBI_VERSION) {\n\n";
foreach ($files as $file) {
	echo "Getting file: ../" . $file . '<br>';
	$code .= file_get_contents("../" . $file) . "\n\n\n\n";
}
$code .= "\n\n}('" . $version . "'));";

file_put_contents("../bbi.all.js", $code);
/*
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, 'output_format=text'
    .'&output_info=compiled_code'
    .'&compilation_level=' . $mode
    .'&warning_level=verbose'
    .'&js_code=' . urlencode($code));
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$result = curl_exec($ch);
curl_close($ch);
//$frontEnd = '/*! BBI Namespace (c) Blackbaud, Inc. ' . htmlentities($result);
//$contents = '/*! BBI Namespace (c) Blackbaud, Inc. ' . "\n" . $result;
//echo $frontEnd;
file_put_contents("../../bbi.min.js", $contents);
*/
