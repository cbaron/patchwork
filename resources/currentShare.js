var Base = require('./__proto__'),
    CurrentShare = function() { return Base.apply( this, arguments ) }

Object.assign( CurrentShare.prototype, Base.prototype, {

    GET() {
        console.log( this.query( true ) )
        return this.dbQuery( { query: this.query( true ) } )
        .then( result => { console.log( result ); return result.rows.length ? Promise.resolve( result ) : this.dbQuery( { query: this.query( false ) } ) } )
        .then( result => this.respond( { body: result.rows.length ? result.rows[0] : { } } ) )
    },

    query( currentShare ) {
        const share = currentShare
            ? `( SELECT s.id FROM share s WHERE now() BETWEEN startdate AND enddate ORDER BY enddate DESC LIMIT 1 )`
            : `( SELECT s.id FROM share s ORDER BY enddate DESC LIMIT 1 )`
        return `SELECT soo.*, dop.* ` +
        `FROM ${share} s ` +
        `LEFT JOIN shareoptionshare sos ON sos.shareid = s.id ` +
        `LEFT JOIN shareoption so ON so.id = sos.shareoptionid ` +
        `LEFT JOIN shareoptionoption soo ON soo.shareoptionid = so.id ` +
        `LEFT JOIN sharedeliveryoption sdo ON sdo.shareid = s.id ` +
        `LEFT JOIN deliveryoption dop ON dop.id = sdo.deliveryoptionid`
    }
    
} )

module.exports = CurrentShare
