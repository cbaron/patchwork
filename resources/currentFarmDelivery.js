var Base = require('./__proto__'),
    CurrentFarmDelivery = function() { return Base.apply( this, arguments ) }

Object.assign( CurrentFarmDelivery.prototype, Base.prototype, {

    GET() {
        return this.dbQuery( { query: `SELECT dr.*, d.* FROM deliveryoption d JOIN deliveryroute dr ON d.name = dr.label WHERE d.name = 'farm'` } )
        .then( results => this.respond( { body: result.rows.length ? results.rows[0] : [ ] } ) )
    }
    
} )

module.exports = CurrentFarmDelivery
