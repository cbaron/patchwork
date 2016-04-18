var MyObject = require('./MyObject'),
    Stripe = function() { return MyObject.apply( this, arguments ) }

Object.assign( Stripe.prototype, MyObject.prototype, {

    charge( data ) {
        return new Promise( ( resolve, reject ) => 
            this.stripe.charges.create( Object.assign( { currency: 'USD' }, data ), ( err, charge ) => {
                if( err ) return reject( err )
                resolve( charge )
            } )
        )
    },

    stripe: require('stripe')( process.env.STRIPEKEY )

} )

module.exports = new Stripe()
