/*! (c) Blackbaud, Inc. */
(function (bbi) {

    var app = bbi.register({
        alias: 'MyApp',
        author: 'First last',
        client: 'Organization, Inc.',
        created: 'mm/dd/yyyy'
    });

    /**
     * A sample action demonstrating basic setup.
     * It can be deleted or repurposed for your own application.
     * You'll execute this action via data- attributes on your webpage:
     * <div data-bbi-app="MyApp" data-bbi-action="HelloWorld"></div>
     */
    app.action("HelloWorld", function (app, bbi, $) {
        return {
            init: function (options, element) {
                if (! bbi.isPageEditor()) {
                    console.log("Hello, World!");
                }
            }
        };
    });

    app.build();

}(window.bbiGetInstance()));
