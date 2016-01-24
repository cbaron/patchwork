var Nav = require('./util/Nav'),
    Header = function() { return Nav.apply( this, arguments ) }

Object.assign( Header.prototype, Nav.prototype, {      

    insertionMethod: 'before',

    size() {
        if( this.$(window).width() > 767 && this.$('.header-title').css( 'display' ) === "none" )
            this.$('.header-title').css( 'display', 'inline-block' )
        if( this.$(window).width() < 768 && this.$('.navbar-collapse').hasClass('in') )
            this.$('.header-title').css( 'display', 'none' )
    },

    template: require('../templates/header')( require('handlebars') )

} )

module.exports = new Header()
