module.exports = Object.assign( { }, require('../../../lib/MyObject').prototype, require('events').EventEmitter.prototype, {

    Currency: new Intl.NumberFormat( 'en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    } ),

    Error: require('../../../lib/MyError'),

    Format: require('../Format'),

    Model: require('../models/__proto__'),

    Moment: require('moment'),

    OptimizedResize: require('./lib/OptimizedResize'),

    UUID: require('uuid-v4'),
    
    P: ( fun, args=[ ], thisArg ) =>
        new Promise( ( resolve, reject ) => Reflect.apply( fun, thisArg || this, args.concat( ( e, ...callback ) => e ? reject(e) : resolve(callback) ) ) ),

    Xhr: require('../Xhr'),

    bindEvent( key, event, el ) {
        var els = el ? [ el ] : Array.isArray( this.els[ key ] ) ? this.els[ key ] : [ this.els[ key ] ]
        els.forEach( el => el.addEventListener( event || 'click', e => this[ `on${this.capitalizeFirstLetter(key)}${this.capitalizeFirstLetter(event)}` ]( e ) ) )
    },

    capitalizeFirstLetter: string => string.charAt(0).toUpperCase() + string.slice(1),

    constructor( opts={} ) {

        if( opts.events ) { Object.assign( this.events, opts.events ); delete opts.events; }
        Object.assign( this, opts )

        this.subviewElements = [ ]

        if( this.requiresLogin && ( !this.user.isLoggedIn() ) ) return this.handleLogin()
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

    fadeInImage( el ) {
        el.onload = () => {
            this.emit( 'imgLoaded', el )
            el.removeAttribute('data-src')
        }

        el.setAttribute( 'src', el.getAttribute('data-src') )
    },

    getContainer() { return this.els.container },

    getData() {
        if( !this.model ) this.model = Object.create( this.Model, { resource: { value: this.name } } )

        return this.model.get()
    },

    getTemplateOptions() {
        const rv = Object.assign( this.user ? { user: this.user.data } : {}, this.Format )

        if( this.model ) {
            rv.model = this.model.data

            if( this.model.meta ) rv.meta = this.model.meta
            if( this.model.attributes ) rv.attributes = this.model.attributes
        }

        if( this.templateOpts ) rv.opts = typeof this.templateOpts === 'function' ? this.templateOpts() : this.templateOpts || {}

        return rv
    },

    handleLogin() {
        this.factory.create( 'login', { insertion: { el: document.querySelector('#content') } } )
        .on( "success", userData => {
            if( !this.isAllowed( userData ) ) return this.scootAway()

            this.user.set( userData )
            this.user.trigger('loggedIn')

            return this.onLogin()
        } )

        return this
    },

    hide( isSlow ) {
        if( !this.els || this.isHiding ) return Promise.resolve()

        this.isHiding = true;
        return this.hideEl( this.els.container, isSlow )
        .then( () => Promise.resolve( this.isHiding = false ) )
    },

    hideSync() { this.els.container.classList.add('fd-hidden'); return this },

    _hideEl( el, resolve, hash, isSlow ) {
        el.removeEventListener( 'animationend', this[ hash ] )
        el.classList.add('fd-hidden')
        el.classList.remove(`animate-out${ isSlow ? '-slow' : ''}`)
        delete this[hash]
        resolve()
    },

    hideEl( el, isSlow ) {
        if( this.isHidden( el ) ) return Promise.resolve()

        const uuid = this.UUID(),
            hash = `${uuid}Hide`

        return new Promise( resolve => {
            this[ hash ] = e => this._hideEl( el, resolve, hash, isSlow )
            el.addEventListener( 'animationend', this[ hash ] )
            el.classList.add(`animate-out${ isSlow ? '-slow' : ''}`)
        } )
    },

    htmlToFragment( str ) {
        let range = document.createRange();
        // make the parent of the first div in the document becomes the context node
        range.selectNode(document.getElementsByTagName("div").item(0))
        return range.createContextualFragment( str )
    },

    initialize() {
        return Object.assign( this, { els: { }, slurp: { attr: 'data-js', view: 'data-view', name: 'data-name', img: 'data-src', bgImg: 'data-bg' }, views: { } } )
    },

    insertToDom( fragment, options ) {
        const insertion = typeof options.insertion === 'function' ? options.insertion() : options.insertion;

        insertion.method === 'insertBefore'
            ? insertion.el.parentNode.insertBefore( fragment, insertion.el )
            : insertion.el[ insertion.method || 'appendChild' ]( fragment )
    },

    isAllowed( user ) {
        if( !this.requiresRole ) return true
        return this.requiresRole && user.roles.includes( this.requiresRole )
    },
    
    isHidden( el ) { return el ? el.classList.contains('fd-hidden') : this.els.container.classList.contains('fd-hidden') },

    loadBgImage( el ) {
        const img = new Image()

        img.onload = () => el.classList.add('bg-loaded')
        img.src = this.Format.ImageSrc( el.getAttribute('data-bg') )
    },

    onLogin() {
        this.initialize().render()
    },

    onNavigation( path ) {
        return this.show().catch( this.Error )
    },

    showNoAccess() {
        alert("No privileges, son")
        return this
    },

    postRender() { return this },

    removeChildren( el ) {
        while( el.firstChild ) { el.removeChild( el.firstChild ) }
    },

    render() {
        if( this.data ) this.model = Object.create( this.Model, { } ).constructor( this.data )

        this.slurpTemplate( {
            insertion: this.insertion || { el: document.body },
            isView: true,
            storeFragment: this.storeFragment,
            template: this.template( this.getTemplateOptions(), { Moment: this.Moment } )
        } )

        this.renderSubviews()

        if( this.size ) { this.size(); this.OptimizedResize.add( this.size.bind(this) ) }

        return this.postRender()
    },

    renderSubviews() {
        this.subviewElements.forEach( obj => {
            const name = obj.name || obj.view

            let opts = { }

            if( this.Views && this.Views[ obj.view ] ) opts = typeof this.Views[ obj.view ] === "object" ? this.Views[ obj.view ] : Reflect.apply( this.Views[ obj.view ], this, [ ] )
            if( this.Views && this.Views[ name ] ) opts = typeof this.Views[ name ] === "object" ? this.Views[ name ] : Reflect.apply( this.Views[ name ], this, [ ] )

            this.views[ name ] = this.factory.create( obj.view, Object.assign( { insertion: { el: obj.el, method: 'insertBefore' } }, opts ) )

            if( this.events.views ) {
                if( this.events.views[ name ] ) this.events.views[ name ].forEach( arr => this.views[ name ].on( arr[0], eventData => Reflect.apply( arr[1], this, [ eventData ] ) ) )
                else if( this.events.views[ obj.view ] ) this.events.views[ obj.view ].forEach( arr => this.views[ name ].on( arr[0], eventData => Reflect.apply( arr[1], this, [ eventData ] ) ) )
            }

            if( obj.el.classList.contains('fd-hidden') ) this.views[name].hideSync()
            obj.el.remove()
        } )

        this.subviewElements = [ ]

        return this
    },

    requiresLogin: false,

    scootAway() {
        this.Toast.showMessage( 'error', 'You are not allowed here.  Sorry.')
        .catch( e => { this.Error( e ); this.emit( 'navigate', `/` ) } )
        .then( () => this.emit( 'navigate', `/` ) )

        return this
    },

    show( isSlow ) {
        return this.showEl( this.els.container, isSlow )
    },

    showSync() { this.els.container.classList.remove('fd-hidden'); return this },

    _showEl( el, resolve, hash, isSlow ) {
        el.removeEventListener( 'animationend', this[hash] )
        el.classList.remove(`animate-in${ isSlow ? '-slow' : ''}`)
        delete this[ hash ]
        resolve()
    },

    showEl( el, isSlow ) {
        const uuid = this.UUID(),
            hash = `${uuid}Show`

        return new Promise( resolve => {
            this[ hash ] = e => this._showEl( el, resolve, hash, isSlow )
            el.addEventListener( 'animationend', this[ hash ] )
            el.classList.remove('fd-hidden')
            el.classList.add(`animate-in${ isSlow ? '-slow' : ''}`)
        } )        
    },

    slideIn( el, direction ) {
        const onSlideEnd = () => {
            el.classList.remove(`slide-in-${direction}`)
            el.removeEventListener( 'animationend', onSlideEnd )
        }

        el.addEventListener( 'animationend', onSlideEnd )
        if( el.classList.contains('fd-hidden') ) el.classList.remove('fd-hidden')
        el.classList.add(`slide-in-${direction}`)
    },

    slideOut( el, direction ) {
        const onSlideEnd = () => {
            el.classList.add('fd-hidden')
            el.classList.remove(`slide-out-${direction}`)
            el.removeEventListener( 'animationend', onSlideEnd )
        }

        el.addEventListener( 'animationend', onSlideEnd )
        el.classList.add(`slide-out-${direction}`)
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
            imgSelector = `[${this.slurp.img}]`,
            bgImgSelector = `[${this.slurp.bgImg}]`,
            firstEl = fragment.querySelector('*')

        if( options.isView || firstEl.getAttribute( this.slurp.attr ) ) this.slurpEl( firstEl )

        Array.from( fragment.querySelectorAll( `${selector}, ${viewSelector}, ${imgSelector}, ${bgImgSelector}` ) ).forEach( el => {
            if( el.hasAttribute( this.slurp.attr ) ) { this.slurpEl( el ) }
            else if( el.hasAttribute( this.slurp.img ) ) return this.fadeInImage( el )
            else if( el.hasAttribute( this.slurp.bgImg ) ) return this.loadBgImage( el )
            else if( el.hasAttribute( this.slurp.view ) ) {
                this.subviewElements.push( { el, view: el.getAttribute(this.slurp.view), name: el.getAttribute(this.slurp.name) } )
            }
        } )
   
        if( options.storeFragment ) return Object.assign( this, { fragment } )

        this.insertToDom( fragment, options )

        if( options.renderSubviews ) this.renderSubviews()

        return this
    },

} )
