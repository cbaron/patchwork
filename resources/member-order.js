var Base = require('./__proto__'),
    MemberOrder = function() { return Base.apply( this, arguments ) }

Object.assign( MemberOrder.prototype, Base.prototype, {

    Currency: new Intl.NumberFormat( 'en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    } ),

    Email: require('../lib/Email'),

    PATCH() {
        return this.slurpBody()
        .then( () => {
            if( !this.user.id ) throw Error("401")
            return this.Q( this.Postgres.transaction( this.gatherQueries() ) )
        } )
        .then( () => this.notify() )
        .then( () => this.respond( { body: { } } ) )
    },

    gatherQueries() {
        const queries = [ ],
            membersharedelivery = this.body.orderOptions.membersharedelivery,
            membershareoption = this.body.orderOptions.membershareoption,
            adjustment = this.body.adjustment,
            initiator = this.user.roles.includes('admin') ? 'admin' : 'customer'
        
        if( Object.keys( membersharedelivery ).length ) {
            queries.push( [
                `UPDATE membersharedelivery SET deliveryoptionid = $1, groupdropoffid = $2 WHERE id = $3;`,
                [ membersharedelivery.deliveryoptionid, membersharedelivery.groupdropoffid, membersharedelivery.id ]
            ] )
        }

        membershareoption.forEach( option => {
            queries.push( [
                `UPDATE membershareoption SET shareoptionoptionid = $1 WHERE id = $2`,
                [ option.shareoptionoptionid, option.id ]
            ] )
        } )

        queries.push( [ `DELETE FROM membershareskipweek WHERE membershareid = $1`, [ this.body.memberShareId ] ] )

        this.body.weekOptions.forEach( date => queries.push( [ `INSERT INTO membershareskipweek ( membershareid, date ) VALUES ( $1, $2 );`, [ this.body.memberShareId, date ] ] ) )

        queries.push( [
            `INSERT INTO "csaTransaction" ( action, value, "memberShareId", description, initiator ) VALUES ( 'Adjustment', $1, $2, $3, $4 )`,
            [ adjustment.value, this.body.memberShareId, [ adjustment.description, this.body.weekDetail ].join(''), initiator ]
        ] )

        return queries
    },

    notify() {
        console.log( this.body )
        console.log( this.body.to )
        console.log( Array.isArray( this.body.to ) )
        console.log( process.env.TEST_EMAIL )
        console.log( [ process.env.TEST_EMAIL ] )
        console.log( this.user.roles.includes('admin') && !this.body.adjustment.sendEmail )

        if( this.user.roles.includes('admin') && !this.body.adjustment.sendEmail ) return this.Q()
        console.log( this.body.previousBalance )
        console.log( this.body.adjustment.value )
        const newBalance = this.body.previousBalance + this.body.adjustment.value
        console.log( 'newBalance' )
        console.log( newBalance )

        return this.Q(
            this.Email.send( {
                to: process.env.NODE_ENV === 'production' ? this.body.to : process.env.TEST_EMAIL,
                from: 'eat.patchworkgardens@gmail.com',
                subject: `Patchwork Gardens CSA : ${this.body.shareLabel} Adjustment`,
                body: [
                    `Hello ${this.body.name},`,
                    `Your ${this.body.shareLabel} CSA order with Patchwork Gardens has been adjusted.`,
                    `Details:`,
                    `${this.body.adjustment.description}`,
                    `${this.body.adjustment.value > 0 ? 'New Charges' : 'Price Reduction'}: ${this.Currency.format( Math.abs(this.body.adjustment.value ) )}`,
                    `New Share Balance: ${this.Currency.format( newBalance )}`,
                    ( newBalance > 0
                        ? `Please send payment at your earliest convenience to Patchwork Gardens, 9057 W Third St, Dayton OH 45417. You may also log in to your account and pay online via credit card. Thank you!`
                        : `If your overall balance with Patchwork is now negative, we will mail a check to you in the near future.` ),
                    `If you believe a mistake has been made, or have any questions, please contact us at eat.patchworkgardens@gmail.com`
                ].join( `${this.Email.newline}${this.Email.newline}` )
            } )
        )
    }

} )

module.exports = MemberOrder
