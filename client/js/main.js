var $ = require('jquery')

require('./polyfill')
require('./babel-polyfill')

window.$ = window.jQuery = $
window.initGMap = () => true

require('bootstrap')
require('./plugins/bootstrap-datetimepicker')
require('./magicsuggest.js')

window.onload = () => {
    require('./router').initialize()
    require('./views/modal')
}
