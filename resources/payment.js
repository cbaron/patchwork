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
            description: `Payment for remaining balance of CSA share ${this.body.share.label}`,
            metadata: { memberid: this.body.member.id, name: this.body.person.name, email: this.body.person.email },
            receipt_email: this.body.person.email,
            source: {
                exp_month: this.body.ccMonth,
                exp_year: this.body.ccYear,
                number: this.body.ccNo,
                object: 'card',
                cvc: this.body.cvc
            },
            statement_descriptor: 'CSA balance payment'
        } )
        .catch( failedPayment => {
            console.log( this.format( '%s Failed payment : %s -- body -- %s', new Date(), failedPayment.stack || failedPayment, JSON.stringify(this.body) ) )
            return this.respond( { stopChain: true, code: 500, body: 'Failed payment. Please try again.' } )
        } )
        .then( charge =>
            this.Postgres.query(
                `INSERT INTO "csaTransaction" ( action, value, "memberShareId", description, initiator ) VALUES ( 'Payment', $1, $2, 'Stripe', 'customer' )`,
                [ this.body.total, this.body.share.membershareid ]
            )
            .catch( e => console.log( `${new Date()} - Failed to create transaction : ${e.stack || e} -- body -- ${JSON.stringify(this.body)}` ) )
        )
        
    },

    notifyCustomer() {
        return this.Email.send( {
            to: process.env.NODE_ENV === 'production' ? this.body.person.email : process.env.TEST_EMAIL,
            from: 'eat.patchworkgardens@gmail.com',
            subject: `Patchwork Gardens Payment Receipt`,
            body:
                `Dear ${this.body.person.name},\n\n` +
                `We are sending you this email to confirm payment for the remaining balance on the following share:\n\n` +
                `${this.body.share.label}\nAmount: ${this.Currency.format( this.body.total )}\n\n` +
                `If you believe a mistake has been made, or have any questions, please contact us at eat.patchworkgardens@gmail.com\n\n` +
                `Thank you!\n` +
                `Patchwork Gardens`
        } )
        .catch( e => Promise.resolve( console.log( 'Failed to send payment details to customer.' ) ) )
    },

    POST() {
        return this.slurpBody()
        .then( () => {
            if( !this.user.id ) throw Error("401")
            return this.validateCreditInfo()
        } )
        .then( () => this.executePayment() )
        .then( () => this.notifyCustomer() )
        .then( () => this.respond( { body: { } } ) )
    },

    validateCreditInfo() {
        this.hasCCInfo = Boolean( this.body.ccNo && this.body.ccMonth && this.body.ccYear && this.body.cvc )

        if( !this.hasCCInfo ) this.respond( { stopChain: true, code: 500, body: 'Credit card information is required.' } )
        
        this.total = Number.parseFloat( this.body.total )

        if( Number.isNaN( this.total ) ) return this.respond( { stopChain: true, code: 500, body: 'Invalid Total.' } )

        return Promise.resolve()
    },

} )

module.exports = Payment