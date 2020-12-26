const EmailVerification = require('../templates/EmailVerification');
const MyObject = require('./MyObject')
const SendGrid = function() { return MyObject.apply( this, arguments ) }

Object.assign( SendGrid.prototype, MyObject.prototype, {

    SendGrid: require('@sendgrid/mail'),

    send( data ) {
        const emailTo = Array.isArray(data.to) ? data.to : [data.to];
        const msg = {
            ...data,
            to: emailTo,
            bcc: 'eat.patchworkgardens@gmail.com'
        };
        if (emailTo.includes('eat.patchworkgardens@gmail.com')) {
            delete msg.bcc
        }
        this.SendGrid.setApiKey( process.env.SENDGRID_API_KEY )

        return new Promise( ( resolve, reject ) => {
            this.SendGrid.send( msg, ( err, result ) => {
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