var Base = require('./__proto__'),
    CurrentShare = function() { return Base.apply( this, arguments ) }

Object.assign( CurrentShare.prototype, Base.prototype, {

    GET() {
        return this.getShareId()
        .then( id =>
            Promise.all( [
                this.dbQuery( { query: this.getOptionQuery( id ) } ),
                this.dbQuery( { query: this.getDeliveryQuery( id ) } )
            ] )
            .then( ( [ produceOptions, deliveryOptions ] ) => this.respond( { body: { id, produceOptions: produceOptions.rows, deliveryOptions: deliveryOptions.rows } } ) )
        )
    },

    getDeliveryQuery( shareId ) {
        return `SELECT dop.* ` +
               `FROM sharedeliveryoption sdo ` +     
               `JOIN deliveryoption dop ON dop.id = sdo.deliveryoptionid ` +
               `WHERE sdo.shareid = ${shareId} ` +
               `ORDER BY dop.price ASC`
    },

    getOptionQuery( shareId ) {
        return `SELECT so.id as "shareOptionId", so.name as "prompt", so.information, soo.* ` +
               `FROM shareoptionshare sos ` +
               `JOIN shareoption so ON so.id = sos.shareoptionid ` +
               `JOIN shareoptionoption soo ON soo.shareoptionid = so.id ` +
               `WHERE sos.shareid = ${shareId} ORDER BY soo.price`
    },

    getShareId() {
        return this.dbQuery( { query: `SELECT s.id FROM share s WHERE now() BETWEEN startdate AND enddate ORDER BY enddate DESC LIMIT 1` } )
        .then( result => result.rows.length ? Promise.resolve( result ) : this.dbQuery( { query: `SELECT s.id FROM share s WHERE startdate > now() ORDER BY startdate ASC LIMIT 1` } ) )
        .then( result => result.rows[0].id )
    }

} )

module.exports = CurrentShare
