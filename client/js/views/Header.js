var Nav = require('./util/Nav'),
    Header = function() { return Nav.apply( this, arguments ) }

Object.assign( Header.prototype, Nav.prototype, {

    insertionMethod: 'before',

    template: require('../templates/header')( require('handlebars') )

} )

module.exports = new Header()
