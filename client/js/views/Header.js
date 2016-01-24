var Nav = require('./util/Nav'),
    Header = function() { return Nav.apply( this, arguments ) }

Object.assign( Header.prototype, Nav.prototype, {      

    insertionMethod: 'before',

    size() {
        if( this.$(window).width() > 767 && this.$('.site-title-text').css( 'display' ) === "none" )
            this.$('.site-title-text').css( 'display', 'inline-block' )
        if( this.$(window).width() < 768 && this.$('.navbar-collapse').hasClass('in') )
            this.$('.site-title-text').css( 'display', 'none' )
    },

    template: require('../templates/header')( require('handlebars') )

} )

module.exports = new Header()
