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
            if( !this.user.id ) throw Error("401") //|| !this.user.roles.includes('admin') 
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
        console.log( 'notify' )
        console.log( [
                    `Hello ${this.body.name},`,
                    `Your ${this.body.shareLabel} CSA order with Patchwork Gardens has been adjusted.`,
                    `Details:`,
                    `${this.body.adjustment.description}`,
                    `Cost: ${this.Currency.format( this.body.adjustment.value )}`,
                    ( this.body.adjustment.value > 0
                        ? `Please send payment at your earliest convenience to Patchwork Gardens, 9057 W Third St, Dayton OH 45417.  Thank you!`
                        : `We will mail a check to you in the near future.` ),
                    `If you believe a mistake has been made, or have any questions, please contact us at eat.patchworkgardens@gmail.com`
                ].join( `${this.Email.newline}${this.Email.newline}` ) )
        if( !this.body.adjustment.sendEmail ) return this.Q()

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
                    `Cost: ${this.Currency.format( this.body.adjustment.value )}`,
                    ( this.body.adjustment.value > 0
                        ? `Please send payment at your earliest convenience to Patchwork Gardens, 9057 W Third St, Dayton OH 45417.  Thank you!`
                        : `We will mail a check to you in the near future.` ),
                    `If you believe a mistake has been made, or have any questions, please contact us at eat.patchworkgardens@gmail.com`
                ].join( `${this.Email.newline}${this.Email.newline}` )
            } )
        )
    },

} )

module.exports = MemberOrder
