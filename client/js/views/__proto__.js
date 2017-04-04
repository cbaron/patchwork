module.exports = Object.assign( { }, require('events').EventEmitter.prototype, {

    Currency: new Intl.NumberFormat( 'en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    } ),

    Error: require('../../../lib/MyError'),

    Model: require('../models/__proto__'),

    Moment: require('moment'),

    OptimizedResize: require('./lib/OptimizedResize'),
    
    P: ( fun, args=[ ], thisArg ) =>
        new Promise( ( resolve, reject ) => Reflect.apply( fun, thisArg || this, args.concat( ( e, ...callback ) => e ? reject(e) : resolve(callback) ) ) ),

    Xhr: require('../Xhr'),

    bindEvent( key, event, el ) {
        var els = el ? [ el ] : Array.isArray( this.els[ key ] ) ? this.els[ key ] : [ this.els[ key ] ]
        els.forEach( el => el.addEventListener( event || 'click', e => this[ `on${this.capitalizeFirstLetter(key)}${this.capitalizeFirstLetter(event)}` ]( e ) ) )
    },

    capitalizeFirstLetter: string => string.charAt(0).toUpperCase() + string.slice(1),

    constructor() {
        if( this.requiresLogin && (!this.user.id ) ) return this.handleLogin()
        if( this.user && !this.isAllowed( this.user.attributes ) ) return this.scootAway()

        return this.initialize().render()
    },

    delegateEvents( key, el ) {
        var type = typeof this.events[key]

        if( type === "string" ) { this.bindEvent( key, this.events[key], el ) }
        else if( Array.isArray( this.events[key] ) ) {
            this.events[ key ].forEach( eventObj => this.bindEvent( key, eventObj ) )
        } else {
            this.bindEvent( key, this.events[key].event )
        }
    },

    delete() {
        return this.hide()
        .then( () => {
            this.els.container.parentNode.removeChild( this.els.container )
            return Promise.resolve( this.emit('deleted') )
        } )
    },

    events: {},

    getData() {
        if( !this.model ) this.model = Object.create( this.Model, { resource: { value: this.name } } )

        return this.model.get()
    },

    getTemplateOptions() {
        const modelData = this.model
            ? this.model.data
                ? this.model.data
                : this.model
            : { }
        return Object.assign(
            {},
            modelData,
            { user: (this.user) ? this.user.data : {} },
            { opts: this.templateOpts
                ? typeof this.templateOpts === 'function'
                    ? this.templateOpts()
                    : this.templateOpts
                 : {} }
        )
    },

    isAllowed( user ) {
        if( !this.requiresRole ) return true
        return this.requiresRole && user.roles.includes( this.requiresRole )
    },

    handleLogin() {

        require('./Login').show().once( "success", userData => {
            if( !this.isAllowed( userData ) ) return this.scootAway()

            this.user.set( userData )
            this.user.trigger('loggedIn')

            return this.onLogin()
        } )

        return this
    },

    hide() {
        if( !this.els || !document.body.contains(this.els.container) || this.isHidden() ) {
            return Promise.resolve()
        } else if( this.els.container.classList.contains('fd-hide') ) {
            return new Promise( resolve => this.once( 'fd-hidden', resolve ) )
        } else {
            return new Promise( resolve => {
                this.onHiddenProxy = e => this.onHidden(resolve)
                this.els.container.addEventListener( 'transitionend', this.onHiddenProxy )
                this.els.container.classList.add('fd-hide')
            } )
        }
    },

    hideEl( el ) {
        if( el.classList.contains('fd-hide') ) {
            return Promise.resolve()
        } else {
            return new Promise( resolve => {
                el.onHiddenProxy = e => this.onElHidden( resolve, el )
                el.addEventListener( 'transitionend', el.onHiddenProxy )
                el.classList.add('fd-hide')
            } )
        }
    },

    htmlToFragment( str ) {
        let range = document.createRange();
        // make the parent of the first div in the document becomes the context node
        range.selectNode(document.getElementsByTagName("div").item(0))
        return range.createContextualFragment( str )
    },

    initialize() {
        return Object.assign( this, { els: { }, slurp: { attr: 'data-js', view: 'data-view' }, views: { } } )
    },
    
    isHidden() { return this.els.container.classList.contains('fd-hidden') },

    onElHidden( resolve, el ) {
        el.removeEventListener( 'transitionend', el.onHiddenProxy )
        el.classList.add('fd-hidden')
        resolve( this.emit( 'elHidden', el ) )
    },

    onHidden( resolve ) {
        this.els.container.removeEventListener( 'transitionend', this.onHiddenProxy )
        this.els.container.classList.add('fd-hidden')
        resolve( this.emit('fd-hidden') )
    },

    onLogin() {
        this.initialize().render()
    },

    onNavigation( path ) {
        return this.show()
    },

    onElShown( resolve, el ) {
        el.removeEventListener( 'transitionend', el.onShownProxy )
        resolve( this.emit( 'elShown' ) )
    },

    onShown( resolve ) {
        this.els.container.removeEventListener( 'transitionend', this.onShownProxy )
        resolve( this.emit( 'shown' ) )
    },

    showNoAccess() {
        alert("No privileges, son")
        return this
    },

    postRender() { return this },

    render() {
        this.slurpTemplate( { template: this.template( this.getTemplateOptions(), { Moment: this.Moment } ), insertion: this.insertion, isView: true } )

        this.renderSubviews()

        if( this.size ) { this.size(); this.OptimizedResize.add( this.size.bind(this) ) }

        return this.postRender()
    },

    renderSubviews() {
        Object.keys( this.viewEls || { } ).forEach( key => {

            if( Array.isArray( this.viewEls[ key ] ) ) {
                this.viewEls[ key ].forEach( el => {
                    const name = el.getAttribute('data-name')
                    let config = this.Views[ name ],
                        opts = { }
                    if( config ) {
                        opts = typeof config === "object"
                            ? config
                            : Reflect.apply( config, this, [ ] )
                    }
                    this.views[ name ] = this.factory.create( key, Object.assign( { insertion: { value: { el, method: 'insertBefore' } } }, opts ) )
                    el.remove()
                } )
                this.viewEls[ key ] = undefined
                return
            }
                

            let opts = { } 
            if( this.Views && this.Views[ key ] ) {
                opts =
                    typeof this.Views[ key ] === "object"
                        ? this.Views[ key ]
                        : Reflect.apply( this.Views[ key ], this, [ ] )
            }
            this.views[ key ] = this.factory.create( key, Object.assign( { insertion: { value: { el: this.viewEls[ key ], method: 'insertBefore' } } }, opts ) )
            this.viewEls[ key ].remove()
            this.viewEls[ key ] = undefined
        } )

        return this
    },

    requiresLogin: false,

    scootAway() {
        this.Toast.show( 'error', 'You are not allowed here.  Sorry.')
        .catch( e => { this.Error( e ); this.emit( 'navigate', `/` ) } )
        .then( () => this.emit( 'navigate', `/` ) )

        return this
    },

    show() {
        if( this.els.container.classList.contains( 'fd-hidden' ) ) {
            this.els.container.classList.remove( 'fd-hidden' )
            
            return new Promise( resolve => {
                setTimeout( () => {
                    this.onShownProxy = e => this.onShown(resolve)
                    this.els.container.addEventListener( 'transitionend', this.onShownProxy )
                    this.els.container.classList.remove( 'fd-hide' )
                }, 10 ) 
            } )
        } else if( this.els.container.classList.contains( 'fd-hide' ) ) {
            this.els.container.classList.remove( 'fd-hide' )
            this.els.container.removeEventListener( 'transitionend', this.onHiddenProxy )
            
            return new Promise( resolve => {
                setTimeout( () => {
                    this.onShownProxy = e => this.onShown(resolve)
                    this.els.container.addEventListener( 'transitionend', this.onShownProxy )
                    this.els.container.classList.remove( 'fd-hide' )
                }, 10 ) 
            } )
        } else {
            return new Promise( resolve => this.once( 'shown', resolve ) )
        }
    },

    showEl( el ) {
        if( el.classList.contains( 'fd-hidden' ) ) {
            el.classList.remove( 'fd-hidden' )
            
            return new Promise( resolve => {
                window.requestAnimationFrame( () => {
                    el.onShownProxy = e => this.onShown( resolve, el )
                    el.addEventListener( 'transitionend', el.onShownProxy )
                    el.classList.remove( 'fd-hide' )
                } )
            } )
        } else if( el.classList.contains( 'fd-hide' ) ) {
            el.classList.remove( 'fd-hide' )
            el.container.removeEventListener( 'transitionend', el.onHiddenProxy )
            
            return new Promise( resolve => {
                window.requestAnimationFrame( () => {
                    el.onShownProxy = e => this.onShown( resolve, el )
                    el.addEventListener( 'transitionend', el.onShownProxy )
                    el.classList.remove( 'fd-hide' )
                } )
            } )
        } else {
            return Promise.resolve()
        }
    },

    slurpEl( el ) {
        var key = el.getAttribute( this.slurp.attr ) || 'container'

        if( key === 'container' ) el.classList.add( this.name )

        this.els[ key ] = Array.isArray( this.els[ key ] )
            ? this.els[ key ].concat( el )
            : ( this.els[ key ] !== undefined )
                ? [ this.els[ key ], el ]
                : el

        el.removeAttribute(this.slurp.attr)

        if( this.events[ key ] ) this.delegateEvents( key, el )
    },

    slurpTemplate( options ) {
        var fragment = this.htmlToFragment( options.template ),
            selector = `[${this.slurp.attr}]`,
            viewSelector = `[${this.slurp.view}]`,
            firstEl = fragment.querySelector('*')

        if( options.isView || firstEl.getAttribute( this.slurp.attr ) ) this.slurpEl( firstEl )
        fragment.querySelectorAll( `${selector}, ${viewSelector}` ).forEach( el => {
            if( el.hasAttribute( this.slurp.attr ) ) { this.slurpEl( el ) }
            else if( el.hasAttribute( this.slurp.view ) ) {
                let attr = el.getAttribute(this.slurp.view)
                if( ! this.viewEls ) this.viewEls = { }
               
                this.viewEls[ attr ] = this.viewEls[ attr ] === undefined
                    ? el
                    : Array.isArray( this.viewEls[ attr ] )
                        ? this.viewEls[ attr ].concat( el )
                        : [ this.viewEls[ attr ], el ]
            }
        } )
          
        options.insertion.method === 'insertBefore'
            ? options.insertion.el.parentNode.insertBefore( fragment, options.insertion.el )
            : options.insertion.method === 'after'
                ? options.insertion.el.parentNode.insertBefore( fragment, options.insertion.el.nextSibling )
                : options.insertion.el[ options.insertion.method || 'appendChild' ]( fragment )

        return this
    }

} )
