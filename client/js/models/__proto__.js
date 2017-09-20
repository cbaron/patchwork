module.exports = Object.assign( { }, require('../../../lib/MyObject').prototype, require('events').EventEmitter.prototype, {

    Xhr: require('../Xhr'),

    delete( id ) {
        return this.Xhr( { method: 'DELETE', resource: this.resource, id } )
        .then( () => {
            const datum = this.data.find( datum => datum.id == id )

            if( this.store ) {
                Object.keys( this.store ).forEach( attr => {
                    this.store[ attr ][ datum[ attr ] ] = this.store[ attr ][ datum[ attr ] ].filter( datum => datum.id != id )
                    if( this.store[ attr ][ datum[ attr ] ].length === 0 ) { this.store[ attr ][ datum[ attr ] ] = undefined }
                } )
            }

            this.data = this.data.filter( datum => datum.id != id )

            return Promise.resolve(id)
        } )
    },

    get( opts={ query:{} } ) {
        if( opts.query || this.pagination ) Object.assign( opts.query, this.pagination )
        return this.Xhr( { method: opts.method || 'get', resource: opts.resource || this.resource, headers: this.headers || {}, qs: opts.query ? JSON.stringify( opts.query ) : undefined } )
        .then( response => {
            this.data = this.parse ? this.parse( response ) : response
            return Promise.resolve(this.data)
        } )
    },

    moneyToReal( price ) { return parseFloat( price.replace( /\$|,/g, "" ) ) },

    patch( id, data ) {
        return this.Xhr( { method: 'patch', id, resource: this.resource, headers: Object.assign( { v2: true }, this.headers || {} ), data: JSON.stringify( data ) } )
        .then( response => {
            if( this.parse ) response = this.parse( [ response ] )[0]

            const oldDataIndex = this.data.findIndex( datum => datum.id == response.id )

            this.data.splice( oldDataIndex, 1, response )
            
            if( this.sortAttr ) this.data.sort( ( a, b ) => a[ this.sortAttr ] > b[ this.sortAttr ] )

            return Promise.resolve( response )
        } )
    },

    post( model ) {
        return this.Xhr( { method: 'post', resource: this.resource, headers: Object.assign( { v2: true }, this.headers || {} ), data: JSON.stringify( model ) } )
        .then( response => {
            if( this.parse ) response = this.parse( [ response ] )[0]

            this.data = this.data ? this.data.concat( response ) : [ response ]

            if( this.sortAttr ) this.data.sort( ( a, b ) => a[ this.sortAttr ] > b[ this.sortAttr ] )

            if( this.store ) Object.keys( this.store ).forEach( attr => this._store( response, attr ) )
    
            this.emit( 'added', response )

            return Promise.resolve( response )
        } )
    },

    set( attr, value ) {
        this.data[ attr ] = value
        this.emit( `${attr}Changed` )
    }

} )
