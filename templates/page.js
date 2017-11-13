module.exports = p =>
`<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" type="text/css" href="/static/css/bootstrap.min.css">
        <link rel="stylesheet" type="text/css" href="/static/css/bootstrap-datetimepicker.min.css">
        <link rel="stylesheet" type="text/css" href="/static/css/typeahead.css">
        <link rel="stylesheet" type="text/css" href="/static/css/magicsuggest.css">
        <link rel="stylesheet" type="text/css" href="/static/css/bundle.css">
        <link rel="stylesheet" type="text/css" href="/static/css/auto-complete.css">
        <link rel="stylesheet" type="text/css" href="/static/css/pikaday.css">
        <link rel="stylesheet" type="text/css" href="/dist/css/main.css.gz">

        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        
        ${ ( p.isDev )
            ? '<script src="/static/js/vendor.js.gz"></script><script src="/dist/js/debug.js.gz"></script>'
            : '<script src="/static/js/bundle.js.gz"></script>'
        }

        <script src="/static/js/babel-polyfill.js"></script>
        <script src="/static/js/bootstrap-typeahead.js"></script>
        <script src="/static/js/magicsuggest.js"></script>
        <script async defer src="https://maps.googleapis.com/maps/api/js?key=${p.googleApiKey}&libraries=places&callback=initGMap"></script>

        <title>${p.title}</title>
    </head>

    <body class="${p.bodyClass}">
        <div>
           <div id="content"></div>
        </div>
    </body>

    ${p.isDev?`<script src="//${process.env.DOMAIN}:35729/livereload.js?snipver=1"/></script>`:''}

</html>`
