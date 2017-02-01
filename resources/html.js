var Html = function( data ) { return Object.assign( this, data ) }

Object.assign( Html.prototype, {

    GET() {
        return this.respond( this.page( {
            bodyClass: this.path[1],
            isDev: Boolean( process.env.NODE_ENV === "development" ),
            googleApiKey: process.env.GOOGLE_API_KEY,
            title: "Patchwork Gardens"
        } ) )
    },

    getHeaders( length ) {
        return {
            'Content-Type': 'text/html',
            'Content-Length': length,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Keep-Alive': 'timeout=50, max=100',
            'Date': new Date().toISOString()
        }
    },
    
    page: require('../templates/page'),

    respond: function( body ) {
        return new Promise( ( resolve, reject ) => {
            this.response.writeHead( 200, this.getHeaders( Buffer.byteLength( body ) ) );
            this.response.end( body );
            resolve()
        } )
    }

} )

module.exports = Html
