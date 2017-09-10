module.exports = Object.assign( {}, require('./__proto__'), require('./util/CustomContent'), {

    tables: [
        { name: 'farmermarket', el: 'farmerMarkets', template: 'location' },
        { name: 'retailoutlet', el: 'retailOutlets', template: 'location' },
        { name: 'restaurant', el: 'restaurants', template: 'location' }
    ],

    templates: {
        location: require('./templates/Location')
    }

} )