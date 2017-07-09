module.exports = Object.assign( {}, require('./__proto__'), require('./util/CustomContent'), {

    tables: [
        { name: 'farmermarket', comparator: 'name', el: 'farmerMarkets', template: 'business' },
        { name: 'retailoutlet', comparator: 'name', el: 'retailOutlets', template: 'business' },
        { name: 'restaurant', comparator: 'name', el: 'restaurants', template: 'restaurant' }
    ],

    templates: {
        business: require('../templates/business')( require('handlebars') ),
        restaurant: require('../templates/restaurant')( require('handlebars') )
    }

} )