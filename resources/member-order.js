var Base = require('./__proto__'),
    MemberOrder = function() { return Base.apply( this, arguments ) }

Object.assign( MemberOrder.prototype, Base.prototype, {

    PATCH() {

        return this.slurpBody()
        .then( () => {
            if( !this.user.id || !this.user.roles.includes('admin') ) throw Error("401")
            return this.Q( this.Postgres.transaction( this.gatherQueries() ) )
        } )
        .then( () => this.respond( { body: { } } ) )
    },

    gatherQueries() {
        const queries = [ ],
            membersharedelivery = this.body.orderOptions.membersharedelivery,
            membershareoption = this.body.orderOptions.membershareoption,
            adjustment = this.body.adjustment
        
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

        queries.push( [ `INSERT INTO "csaTransaction" ( action, value, "memberShareId", description ) VALUES ( 'Adjustment', $1, $2, $3 )`, [ adjustment.value, this.body.memberShareId, adjustment.description ] ] )

        return queries
    }

} )

module.exports = MemberOrder
