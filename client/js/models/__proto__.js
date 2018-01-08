module.exports = Object.assign( { }, require('../../../lib/Model'), require('events').EventEmitter.prototype, {

    Xhr: require('../Xhr'),

    add( datum ) {
        this.data.push( datum )

        if( this.storeBy ) this._storeOne( datum )

        return this
    },

    delete() {
        const keyValue = this.data[ this.meta.key ]
        return this.Xhr( { method: 'DELETE', resource: this.resource, id: keyValue } )
        .then( () => {
            const key = this.meta.key

            if( Array.isArray( this.data ) ) {
                const datum = this.data.find( datum => datum[ key ] == keyValue )

                if( this.store ) {
                    Object.keys( this.store ).forEach( attr => {
                        this.store[ attr ][ datum[ attr ] ] = this.store[ attr ][ datum[ attr ] ].filter( datum => datum[ key ] != keyValue )
                        if( this.store[ attr ][ datum[ attr ] ].length === 0 ) { this.store[ attr ][ datum[ attr ] ] = undefined }
                    } )
                }

                this.data = this.data.filter( datum => datum[ key ] != keyValue )
            }

            return Promise.resolve( this.data )
        } )
    },

    get( opts={ query:{} } ) {
        if( opts.query || this.pagination ) Object.assign( opts.query, this.pagination )
        return this.Xhr( { method: opts.method || 'get', resource: opts.resource || this.resource, headers: this.headers || {}, qs: opts.query ? JSON.stringify( opts.query ) : undefined } )
        .then( response => {
            this.data = this.parse ? this.parse( response ) : response
            return Promise.resolve( this.data )
        } )
    },

    getCount() {
        return this.Xhr( { method: 'get', resource: this.resource, headers: this.headers || {}, qs: JSON.stringify( { countOnly: true } ) } )
        .then( ( { result } ) => {
            this.meta.count = result
            return Promise.resolve( result )
        } )
    },

    git( attr ) { return this.data[ attr ] },

    moneyToReal( price ) { return parseFloat( price.replace( /\$|,/g, "" ) ) },

    patch( id, data ) {
        return this.Xhr( { method: 'patch', id, resource: this.resource, headers: this.headers || {}, data: JSON.stringify( data || this.data ) } )
        .then( response => {
           
            if( Array.isArray( this.data ) ) { 
                this.data = this.data ? this.data.concat( response ) : [ response ]
                if( this.store ) Object.keys( this.store ).forEach( attr => this._store( response, attr ) )
            } else {
                this.data = response
            }

            return Promise.resolve( response )
        } )
    },

    _put( keyValue, data ) {
        let item = this.data.find( datum => datum[ this.meta.key ] == keyValue );
        if( item ) item = data;
        return this
    },

    put( id, data ) {
        return this.Xhr( { method: 'put', id, resource: this.resource, headers: this.headers || {}, data: JSON.stringify( data ) } )
        .then( response => {
           
            if( Array.isArray( this.data ) ) { 
            } else {
                this.data = response
            }

            return Promise.resolve( response )
        } )
    },

    post( model ) {
        return this.Xhr( { method: 'post', resource: this.resource, headers: Object.assign( { v2: true }, this.headers || {} ), data: JSON.stringify( model || this.data ) } )
        .then( response => {
            
            if( Array.isArray( this.data ) ) { 
                this.data = this.data ? this.data.concat( response ) : [ response ]
                if( this.store ) Object.keys( this.store ).forEach( attr => this._store( response, attr ) )
            } else {
                this.data = response
            }

            return Promise.resolve( response )
        } )
    },

    remove( item ) {
        const index = this.data.findIndex( datum => JSON.stringify( datum ) === JSON.stringify( item ) )

        if( index === -1 ) return

        this.data.splice( index, 1 )
    },

    set( attr, value ) {
        this.data[ attr ] = value
        this.emit( `${attr}Changed` )
    },

    validate( data ) {
        let valid = true
       
        Object.keys( data ).forEach( name => { 
            const val = data[ name ],
                attribute = this.attributes.find( attr => attr.name === name )       
    
            if( attribute === undefined || !attribute.validate ) {
                this.data[ name ] = val
                    ? typeof val === 'string'
                         ? val.trim() 
                         : val
                    : undefined
            } else if( valid && !this.validateDatum( attribute, val ) ) {
                this.emit( 'validationError', attribute )
                valid = false
            } else if( this.validateDatum( attribute, val ) ) {
                this.data[ name ] = val.trim()
            }
        } )

        return valid//return Promise.resolve( valid )
    },

    validateDatum( attr, val ) {
        return attr.validate.call( this, val.trim() )
    },

    validateRepeatPassword( valid ) {
        if( !valid ) return Promise.resolve( false )

        if( this.data.repeatPassword !== this.data.password ) {
            this.emit( 'validationError', this.attributes.find( attr => attr.name === 'repeatPassword' ) )
            valid = false
        }

        return Promise.resolve( valid )
    }

} )
