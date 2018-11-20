const MyObject = require('./MyObject')
const SendGrid = function() { return MyObject.apply( this, arguments ) }

Object.assign( SendGrid.prototype, MyObject.prototype, {

    SendGrid: require('@sendgrid/mail'),

    send( data ) {
        this.SendGrid.setApiKey( process.env.SENDGRID_API_KEY )

        return new Promise( ( resolve, reject ) => {
            this.SendGrid.send( data, ( err, result ) => {
                if( err ) {
                    console.log( `Error sending email : ${err.stack || err}` )
                    reject( err )
                }
                resolve( result )
            } )
        } )
    }

} )

module.exports = new SendGrid()