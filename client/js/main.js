var $ = require('jquery')

require('./polyfill')

window.$ = window.jQuery = $
window.initGMap = () => true

require('bootstrap')
require('./plugins/bootstrap-datetimepicker')

window.onload = () => {
    require('./router').initialize()
    require('./views/modal')
}
