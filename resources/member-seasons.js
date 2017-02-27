var Base = require('./__proto__'),
    MemberSeasons = function() { return Base.apply( this, arguments ) }

Object.assign( MemberSeasons.prototype, Base.prototype, {

    db: Object.assign( {}, Base.prototype.db, {
        GET() {
            return this.dbQuery( {
                query: `SELECT * FROM share JOIN membershare ms on ms.shareid = share.id WHERE ms.memberid = $1`,
                values: [ this.path[2] ]
            } )
        }
    } )

} )

module.exports = MemberSeasons