module.exports = Object.assign( {}, require('./__proto__'), {

    CsaDelivery: require('./CsaDelivery'),

    getHours() {
        return this.CsaDelivery.get( { query: { label: 'farm' } } )
        .then( () => {
            const farmPickup = this.CsaDelivery.data[0]
            this.data[0].hours = `${farmPickup.dayOfWeek} ${farmPickup.starttime} - ${farmPickup.endtime}`
            return Promise.resolve()
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