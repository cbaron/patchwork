var $ = require('jquery'),
    router = require('./router');

window.$ = window.jQuery = $

require('bootstrap')
require('./plugins/bootstrap-datetimepicker')

$( function() {
    require('./views/modal')
    require('backbone').history.start( { pushState: true } )
} )
