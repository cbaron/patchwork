var Nav = require('./util/Nav'),
    Header = function() { return Nav.apply( this, arguments ) }

Object.assign( Header.prototype, Nav.prototype, {      

    insertionMethod: 'before',

    postRender() {
        console.log('header postRender')
        var headerImages = new ( this.Collection.extend( { url: "/header" } ) )()
        headerImages.fetch().then( () => {
            headerImages.models.forEach( model => {
                console.log(model)
            })
        })
    },

    size() {
        if( this.$(window).width() > 767 ) {
            this.templateData.headerTitle.on( 'click', this.navigate.bind(this) )
            if( this.$('.header-title').css( 'display' ) === "none" )
                this.$('.header-title').css( 'display', 'inline-block' )
        }
        if( this.$(window).width() < 768 ) {
            this.templateData.headerTitle.off( 'click' )
            if( this.$('.navbar-collapse').hasClass('in') )
                this.$('.header-title').css( 'display', 'none' )
        }
    },

    template: require('../templates/header')( require('handlebars') )

} )

module.exports = new Header()
