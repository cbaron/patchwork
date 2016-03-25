var Nav = require('./util/Nav'),
    Header = function() { return Nav.apply( this, arguments ) }

Object.assign( Header.prototype, Nav.prototype, {      

    bindHeaderEvents() {
        this.templateData.navLinks.children('li').on( {
            mouseenter: ( event ) => this.loadHoverColor( event ),
            mouseleave: ( event ) => this.loadColor( event )
        } )
        
        this.templateData.headerTitle.on( {
            click: ( e ) => this.navigate( e ),
            mouseenter: ( e ) => this.loadHoverColor( e ),
            mouseleave: ( e ) => this.loadColor( e )
        } )       
    },

    initiateHeader( resource ) {
        var headerImages = new ( this.Collection.extend( { url: "/header" } ) )()
        headerImages.fetch().then( () => {
            headerImages.models.forEach( model => {
                if( model.get('page') === resource ) {
                    this.model = model
                    this.size()                                      
                }                
            } )
        } )
    },

    insertionMethod: 'before',

    loadColor( event ) { this.$( event.target ).css( 'color', this.model.get('color') ) },

    loadHoverColor( event ) { this.$( event.target ).css( 'color', this.model.get('hovercolor') ) },

    loadHeader( model ) {
        this.templateData.container
            .css( 'background-image', this.util.format( "url( /file/header/image/%d )", model.id ) )
        this.templateData.navLinks.children('li').css( 'color', model.get('color') )
        this.templateData.headerTitle.css( 'color', model.get('color') )
    },

    loadMobileHeader( model ) {
        this.templateData.container
            .css( 'background-image', this.util.format( "url( /file/header/mobileimage/%d )", model.id ) )
        this.templateData.navLinks.children('li').css( 'color', '#ccc' )
        this.templateData.headerTitle.css( 'color', model.get('color') )
    },

    removeHeaderEvents() {
        this.templateData.navLinks.children('li').off( 'mouseenter mouseleave' )
        this.templateData.headerTitle.off( 'click mouseenter mouseleave')
    },

    size() {
        var model = this.model

        if( this.$(window).width() > 767 ) {
            this.bindHeaderEvents()
            if( model ) this.loadHeader( model )
            if( this.templateData.headerTitle.css( 'display' ) === "none" )
                this.templateData.headerTitle.css( 'display', 'inline-block' )
        }
        if( this.$(window).width() < 768 ) {
            this.removeHeaderEvents()
            if( model ) this.loadMobileHeader( model )
            if( this.templateData.navbarCollapse.hasClass('in') )
                this.templateData.headerTitle.css( 'display', 'none' )
        }
    },

    template: require('../templates/header')( require('handlebars') )

} )

module.exports = new Header()
