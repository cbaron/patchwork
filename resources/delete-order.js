var BaseResource = require('./__proto__'),
    DeleteOrder = function() { return BaseResource.apply( this, arguments ) }

Object.assign( DeleteOrder.prototype, BaseResource.prototype, {

    async DELETE() {
        await Reflect.apply( this.validate.DELETE, this, [ ] )
        await this.validateUser()

        await this.Postgres.transaction( [
            [ `DELETE FROM membershareoption WHERE membershareid = $1`, [ this.path[2] ] ],
            [ `DELETE FROM membersharedelivery WHERE membershareid = $1`, [ this.path[2] ] ],
            [ `DELETE FROM membershareskipweek WHERE membershareid = $1`, [ this.path[2] ] ],
            [ `DELETE FROM "memberShareSeasonalAddOn" WHERE "memberShareId" = $1`, [ this.path[2] ] ],
            [ `DELETE FROM "csaTransaction" WHERE "memberShareId" = $1`, [ this.path[2] ] ],
            [ `DELETE FROM membershare WHERE id = $1`, [ this.path[2] ] ]
        ] )

        this.respond( { body: { } } )
    }

} )

module.exports = DeleteOrder