module.exports = p =>
`<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" type="text/css" href="/static/css/bootstrap.min.css">
        <link rel="stylesheet" type="text/css" href="/static/css/bootstrap-datetimepicker.min.css">
        <link rel="stylesheet" type="text/css" href="/static/css/typeahead.css">
        <link rel="stylesheet" type="text/css" href="/static/css/magicsuggest.css">
        <link rel="stylesheet" type="text/css" href="/static/css/bundle.css">

        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        
        <script src="https://maps.googleapis.com/maps/api/js?key=${p.googleApiKey}&libraries=places">
        <script src="/static/js/babel-polyfill.js"></script>
        <script src="/static/js/bundle.js"${p.firefox? ' type="application/javascript;version=1.7"' : ''}></script>
        <script src="/static/js/bootstrap-typeahead.js"></script>
        <script src="/static/js/magicsuggest.js"></script>

        <title>${p.title}</title>
    </head>

    <body class="${p.bodyClass}">
        <div class="container-fluid">
           <div class="row" id="content"></div>
        </div>
    </body>

</html>`
