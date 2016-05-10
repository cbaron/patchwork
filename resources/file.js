var BaseResource = require('./__proto__'),
    File = function() { return BaseResource.apply( this, arguments ) }

Object.assign( File.prototype, BaseResource.prototype, {

    POST() {
        return this.validate.POST.call(this)
        .then( () => {
            var fileStream = this.fs.createWriteStream(
                this.format( "%s/../static/data/%s/%s/%s", __dirname, this.path[0], this.path[1], this.path[2] ),
                { defaultEncoding: 'binary' }
            )

            if( this.user.roles.indexOf( "admin" ) === -1 ) new Error("Sorry Mate")
             
            this.request.on( 'error', err => new Error(err) )
            this.request.on( 'data', chunk => fileStream.write( new Buffer( chunk, 'base64' ).toString('binary'), 'binary' ) )
            this.request.on( 'end', () => { fileStream.end(); this.respond( { body: true } ) } )
        } )
    },

    fs: require('fs')

} )

module.exports = File
