var $ = require('jquery'),
    router = require('./router');

window.$ = window.jQuery = $

require('babel-polyfill')
require('bootstrap')
require('./plugins/bootstrap-datetimepicker')

$( () => {
    require('./views/modal')
    require('backbone').history.start( { pushState: true } )
} )
