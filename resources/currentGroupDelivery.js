var Base = require('./__proto__'),
    CurrentGroupDelivery = function() { return Base.apply( this, arguments ) }

Object.assign( CurrentGroupDelivery.prototype, Base.prototype, {

    GET() {
        return this.getShareId()
        .then( id => this.dbQuery( { query: this.query( id ) } ) )
        .then( results => this.respond( { body: results.rows } ) )
    },
    
    currentShare: `JOIN ( SELECT id FROM share WHERE enddate > now() AND startdate < now() ) share ON share.id = sgd.shareid `,

    query( shareId ) {
        return `SELECT DISTINCT ON ("groupId") sgd.*, gdo.id as "groupId", gdo.name, gdo.label, gdo.address ` +
               `FROM sharegroupdropoff sgd ` +
               `JOIN share s ON s.id = sgd.shareid ` +
               `JOIN groupdropoff gdo ON gdo.id = sgd.groupdropoffid ` +
               `WHERE s.id = ${shareId}`
    },

    getShareId() {
        return this.dbQuery( { query: `SELECT s.id FROM share s WHERE now() BETWEEN startdate AND enddate ORDER BY enddate DESC LIMIT 1` } )
        .then( result => result.rows.length ? Promise.resolve( result ) : this.dbQuery( { query: `SELECT s.id FROM share s ORDER BY enddate DESC LIMIT 1` } ) )
        .then( result => result.rows[0].id )
    }

} )

module.exports = CurrentGroupDelivery
