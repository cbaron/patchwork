var $ = require('jquery'),
    router = require('./router');

Number.isInteger = Number.isInteger || function(value) {
  return typeof value === "number" && 
    isFinite(value) && 
    Math.floor(value) === value;
};

window.$ = window.jQuery = $

require('bootstrap')
require('./plugins/bootstrap-datetimepicker')

$( () => {
    require('./views/modal')
    require('backbone').history.start( { pushState: true } )
} )
