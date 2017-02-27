var Base = require('./__proto__'),
    NeverReceive = function() { return Base.apply( this, arguments ) }

Object.assign( NeverReceive.prototype, Base.prototype, {

    db: Object.assign( {}, Base.prototype.db, {
        GET() {
            return this.dbQuery( {
                query:
                    `SELECT omit.*, p.name as "produceName", pf.name as "produceFamilyName" ` +
                    `FROM memberfoodomission omit ` +
                    `LEFT JOIN produce p ON p.id = omit.produceid ` +
                    `LEFT JOIN producefamily pf ON pf.id = omit.producefamilyid ` +
                    `WHERE omit.memberid = $1`,
                values: [ this.path[2] ]
            } )
        }
    } )

} )

module.exports = NeverReceive