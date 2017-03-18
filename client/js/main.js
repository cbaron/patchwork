var $ = require('jquery')

require('./polyfill')

window.$ = window.jQuery = $
window.initGMap = () => true

require('bootstrap')
require('./plugins/bootstrap-datetimepicker')

window.onload = () => {
    require('./router') 
    require('./views/modal')
    require('backbone').history.start( { pushState: true } )
}
