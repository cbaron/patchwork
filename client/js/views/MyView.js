var _ = require('underscore'),
    $ = require('jquery'),
    fs = require('fs'),
    MyView = function( data ) { return _.extend( this, data ).initialize() },
    user = require('../models/User');

_.extend( MyView.prototype, require('events').EventEmitter.prototype, {

    _: _,

    $: $,

    Collection: require('backbone').Collection.extend( { parse: ( response, options ) => response.result } ),

    delete: function() {
        this.templateData.container.remove()
        this.emit("removed")
    },

    format: {
        capitalizeFirstLetter: string => string.charAt(0).toUpperCase() + string.slice(1)
    },

    getFormData: function() {
        this.formData = { }

        this._.each( this.templateData, ( $el, name ) => { if( $el.prop("tagName") === "INPUT" && $el.val() ) this.formData[name] = $el.val() } )

        return this.formData
    },

    getRouter: function() { return require('../router') },

    getTemplateOptions: () => ({}),

    hide: function() {
        return this.Q.Promise( function( resolve, reject ) {
            this.templateData.container.hide();
            resolve();
        }.bind(this) );
    },

    initialize: function() {

        if( ! this.container ) this.container = this.$('#content')
        
        if( ! this.user ) this.user = user

        this.router = this.getRouter()

        this.modalView = require('./modal')

        if( this.requiresLogin && ! this.user.id ) {
            require('./Login').show().once( "success", e => {
                this.render()
                require('./Header').onUser( this.user )
            } )
            return this
        }

        this.$(window).resize( this.size.bind(this) )

        return this.render()
    },

    isHidden: function() { return this.templateData.container.css('display') === 'none' },

    Model: require('backbone').Model,
    
    moment: require('moment'),

    postRender: function() {return this},

    Q: require('q'),

    render: function() {
        this.slurpTemplate( {
            template: this.template( this.getTemplateOptions() ),
            insertion: { $el: this.insertionEl || this.container, method: this.insertionMethod } } )

        this.size()

        this.postRender()

        return this
    },

    renderSubviews: function() {
        Object.keys( this.subviews || [ ] ).forEach( key => 
            this.subviews[ key ].forEach( subviewMeta => {
                this[ subviewMeta.name ] = new subviewMeta.view( { container: this.templateData[ key ] } ) } ) )
    },

    show: function() {
        this.templateData.container.show()
        this.size()
        return this;
    },

    slurpEl: function( el ) {

        var key = el.attr('data-js');

        this.templateData[ key ] = ( this.templateData.hasOwnProperty(key) )
            ? this.templateData[ key ].add( el )
            : el;

        el.removeAttr('data-js');

        if( this.events[ key ] ) this.delegateEvents(key, el)
        if( el.attr('data-e') ) this.delegateEvents( el.attr('data-e'), el ); el.removeAttr('data-e')

        return this;
    },

    slurpTemplate: function( options ) {

        var $html = this.$( options.template ),
            selector = '[data-js]';

        if( this.templateData === undefined ) this.templateData = { };

        $html.each( ( index, el ) => {
            var $el = this.$(el);
            if( $el.is( selector ) ) this.slurpEl( $el )
        } );

        $html.get().forEach( ( el ) => { this.$( el ).find( selector ).each( ( i, elToBeSlurped ) => this.slurpEl( this.$(elToBeSlurped) ) ) } )
       
        if( options && options.insertion ) options.insertion.$el[ ( options.insertion.method ) ? options.insertion.method : 'append' ]( $html )

        return this;
    },
    
    delegateEvents: function( key, el ) {

        this._.each( this.events, ( eventData, elementKey ) => {
            var type;

            if( key === elementKey ) {
                
                var type = Object.prototype.toString.call( eventData );

                if( type === '[object Object]' ) {
                    this.bindEvent( elementKey, eventData, el );
                } else if( type === '[object Array]' ) {
                    eventData.forEach( singleEvent => this.bindEvent( elementKey, singleEvent, el ) )
                }
            }
        } );
    },

    bindEvent: function( elementKey, eventData, el ) {
        var elements = ( el ) ? el : this.templateData[ elementKey ];

        elements.on( eventData.event, eventData.selector, eventData.meta, this[ eventData.method ].bind(this) )
    },

    events: {},

    isMouseOnEl: function( event, el ) {

        var elOffset = el.offset(),
            elHeight = el.outerHeight( true ),
            elWidth = el.outerWidth( true );

        if( ( event.pageX < elOffset.left ) ||
            ( event.pageX > ( elOffset.left + elWidth ) ) ||
            ( event.pageY < elOffset.top ) ||
            ( event.pageY > ( elOffset.top + elHeight ) ) ) {

            return false;
        }

        return true;
    },

    requiresLogin: true,
    
    routeToApp: () => { window.location = '/ios/handle' },

    size: function(){return this},

    util: require('util')

} )

module.exports = MyView
