var Base = require('./__proto__'),
    CurrentGroupDelivery = function() { return Base.apply( this, arguments ) }

Object.assign( CurrentGroupDelivery.prototype, Base.prototype, {

    GET() {
        return this.dbQuery( { query: this.query( true ) } )
        .then( results => results.rows.length ? Promise.resolve( results ) : this.dbQuery( { query: this.query( false ) } ) )
        .then( results => this.respond( { body: results.rows } ) )
    },
    
    currentShare: `JOIN ( SELECT id FROM share WHERE enddate > now() AND startdate < now() ) share ON share.id = sgd.shareid `,

    query( getCurrentShare ) {
        return `SELECT sgd.*, gdo.* ` +
               `FROM sharegroupdropoff sgd ` +
               ( getCurrentShare ? this.currentShare : `` ) +
               `JOIN groupdropoff gdo ON gdo.id = sgd.groupdropoffid`
    }

} )

module.exports = CurrentGroupDelivery
