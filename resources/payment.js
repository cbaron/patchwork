var Base = require('./__proto__'),
    Payment = function() { return Base.apply( this, arguments ) }

Object.assign( Payment.prototype, Base.prototype, {

    Currency: new Intl.NumberFormat( 'en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    } ),

    Email: require('../lib/Email'),

    Stripe: require('../lib/stripe'),

    executePayment() {
        return this.Stripe.charge( {
            amount: Math.floor( this.total * 100 ),
            description: 'Payment for remaining balance of CSA share',
            metadata: { memberid: this.body.member.id, name: this.body.person.name, email: this.body.person.email },
            receipt_email: process.env.TEST_EMAIL,//this.body.person.email,
            source: {
                exp_month: this.body.ccMonth,
                exp_year: this.body.ccYear,
                number: this.body.ccNo,
                object: 'card',
                cvc: this.body.cvc
            },
            statement_descriptor: 'Patchwork Gardens CSA balance payment'
        } )
        .catch( failedPayment => {
            console.log( this.format( '%s Failed payment : %s -- body -- %s', new Date(), failedPayment.stack || failedPayment, JSON.stringify(this.body) ) )
            this.error = "Failed payment. Please try again."
        } )
        .then( charge => {
            console.log( 'charge' )
            console.log( charge )
            if( this.error ) return
            
            return this.Postgres.query(
                `INSERT INTO "csaTransaction" ( action, value, "memberShareId", description, initiator ) VALUES ( 'Payment', $1, $2, 'Stripe', 'customer' )`,
                [ this.body.total, this.body.memberShareId ]
            )
        } )
        .catch( e => console.log( `${new Date()} - Failed to create transaction : ${e.stack || e} -- body -- ${JSON.stringify(this.body)}` ) )
    },

    notifyCustomer() {
        console.log( 'notify' )
        return this.Email.send( {
            to: process.env.TEST_EMAIL,
            from: 'eat.patchworkgardens@gmail.com',
            subject: `Patchwork Gardens Payment Receipt`,
            body: 'Test email body'

        } )
        .catch( e => Promise.resolve( console.log( 'Failed to send payment details to customer.' ) ) )
    },

    POST() {
        return this.slurpBody()
        .then( () => {
            if( !this.user.id ) throw Error("401")
            return this.validate()
        } )
        .then( () => this.executePayment() )
        .then( () => this.notifyCustomer() )
        .then( () => this.respond( { body: { } } ) )
    },

    validate() {
        this.hasCCInfo = Boolean( this.body.ccName && this.body.ccNo && this.body.ccMonth && this.body.ccYear && this.body.cvc )

        if( !this.hasCCInfo ) this.respond( { stopChain: true, code: 500, body: { message: 'Credit card information is required.' } } )
        
        this.total = Number.parseFloat( this.body.total )

        if( Number.isNaN( this.total ) ) return this.respond( { stopChain: true, code: 500, body: { message: 'Invalid Total.' } } )

        return Promise.resolve()
    },

} )

module.exports = Payment