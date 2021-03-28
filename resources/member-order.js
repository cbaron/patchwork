var Base = require('./__proto__'),
    MemberOrder = function() { return Base.apply( this, arguments ) }

Object.assign( MemberOrder.prototype, Base.prototype, {

    SendGrid: require('../lib/SendGrid'),

    async PATCH() {
        await this.slurpBody()

        if( !this.user.id ) throw Error("401")

        await this.Postgres.transaction( this.gatherQueries() )
        await this.notify()
        
        this.respond( { body: { } } )
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
        if( this.user.roles.includes('admin') && !this.body.adjustment.sendEmail ) return Promise.resolve()

        const newBalance = this.body.previousBalance + this.body.adjustment.value

        return this.SendGrid.send( {
            to: process.env.NODE_ENV === 'production' ? this.body.to : process.env.TEST_EMAIL,
            from: 'Patchwork Gardens <eat@patchworkgardens.net>',
            subject: `Patchwork Gardens CSA: ${this.body.shareLabel} Adjustment`,
            html: this.Templates.EmailBase({ emailBody: this.Templates.OrderUpdateReceipt(this.body) })
        } )
    },

    Templates: {
        EmailBase: require('../templates/EmailBase'),
        OrderUpdateReceipt: require('../templates/OrderUpdateReceipt')
    }

} )

module.exports = MemberOrder
