var Nav = require('./util/Nav'),
    Footer = function() { return Nav.apply( this, arguments ) }

Object.assign( Footer.prototype, Nav.prototype, {

    insertionMethod: 'after',

    template: require('../templates/footer')( require('handlebars') )

} )

module.exports = new Footer()