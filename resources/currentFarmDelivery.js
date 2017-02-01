var Base = require('./__proto__'),
    CurrentFarmDelivery = function() { return Base.apply( this, arguments ) }

Object.assign( CurrentFarmDelivery.prototype, Base.prototype, {

    GET() {
        return Promise.all( [
            this.dbQuery( { query: `SELECT dr.*, d.* FROM deliveryoption d JOIN deliveryroute dr ON d.name = dr.label WHERE d.name = 'farm'` } ),
            this.dbQuery( { query: `SELECT farmpickup FROM contactinfo LIMIT 1` } )
        ] )
        .then( ( [ deliveryOption, farmPickup ] ) =>
            this.respond( { body: deliveryOption.rows.length && farmPickup.rows.length ? Object.assign( {}, deliveryOption.rows[0], farmPickup.rows[0] ) : { } } )
        )
    }
    
} )

module.exports = CurrentFarmDelivery
