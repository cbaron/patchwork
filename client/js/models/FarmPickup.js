module.exports = Object.assign( {}, require('./__proto__'), {

    DeliveryRoute: require('./DeliveryRoute'),

    getHours() {
        return new Promise( ( resolve, reject ) => {
            const farmPickup = new ( this.DeliveryRoute.extend( { parse: response => this.DeliveryRoute.prototype.parse( response[0] ) } ) )()
            
            farmPickup.fetch( { data: { label: 'farm' } } ).then( () => {
                this.data[0].hours = `${farmPickup.get('dayOfWeek')} ${farmPickup.get('starttime')} - ${farmPickup.get('endtime')}`
                return resolve()
            } )
            .fail( e => reject( e ) )
        } )
    },

    parse( response ) {
        return response.map( row => Object.assign( {
            name: 'Pick-up from our farm!',
            street: row.farmpickup.split(',')[0],
            cityStateZip: row.cityStateZip,
            location: JSON.parse( row.location ).coordinates
        } ) )
    },

    resource: 'contactinfo'

} )