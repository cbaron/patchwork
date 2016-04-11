var Nav = require('./util/Nav'),
    Header = function() { return Nav.apply( this, arguments ) }

Object.assign( Header.prototype, Nav.prototype, {      

    bindHeaderEvents() {
        this.templateData.navLinks.children('li').on( {
            mouseenter: ( e ) => this.loadHoverColor( e ),
            mouseleave: ( e ) => this.loadColor( e )
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

    loadHoverColor( event ) {
        var el = $( event.target )
        if( el.attr('data-id') !== 'home') this.$( event.target ).css( 'color', this.model.get('hovercolor') )
    },

    loadHeader( model ) {
        this.templateData.container
            .css( 'background-image', this.util.format( "url( /file/header/image/%d )", model.id ) )
    },

    loadMobileHeader( model ) {
        this.templateData.container
            .css( 'background-image', this.util.format( "url( /file/header/mobileimage/%d )", model.id ) )
    },

    removeHeaderEvents() {
        this.templateData.navLinks.children('li').off( 'mouseenter mouseleave' )
        this.templateData.headerTitle.off( 'click mouseenter mouseleave')
    },

    size() {
        var model = this.model,
            width = this.$(window).width(),
            height = this.templateData.container.height(),
            aspectRatio = width / height
        
        if( window.innerWidth > 767 && model ) {
            this.loadHeader( model )
            this.bindHeaderEvents()
            this.templateData.navLinks.children('li').css( 'color', model.get('color') )
            this.templateData.headerTitle.css( 'color', model.get('color') ) 
        
            if( this.templateData.headerTitle.css( 'display' ) === "none" )
                this.templateData.headerTitle.css( 'display', 'inline-block' )
        }
        if( window.innerWidth < 768 && model ) {

            ( aspectRatio > 1.6 ) ? this.loadHeader( model ) : this.loadMobileHeader( model )

            this.removeHeaderEvents()
            this.templateData.navLinks.children('li').css( 'color', '#ccc' )
            this.templateData.headerTitle.css( 'color', model.get('color') )
            
            if( this.templateData.navbarCollapse.hasClass('in') )
                this.templateData.headerTitle.css( 'display', 'none' )
        }

    },

    template: require('../templates/header')( require('handlebars') )

} )

module.exports = new Header()
