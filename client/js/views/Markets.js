var CustomContent = require('./util/CustomContent'),
    Markets = function() { return CustomContent.apply( this, arguments ) }

Object.assign( Markets.prototype, CustomContent.prototype, {

    requiresLogin: false,

    tables: [
        { name: 'farmermarket', comparator: 'name', el: 'farmerMarkets', template: 'business' },
        { name: 'retailoutlet', comparator: 'name', el: 'retailOutlets', template: 'business' },
        { name: 'restaurant', comparator: 'name', el: 'restaurants', template: 'restaurant' }
    ],

    template: require('../templates/markets')( require('handlebars') ),

    templates: {
        business: require('../templates/business')( require('handlebars') ),
        restaurant: require('../templates/restaurant')( require('handlebars') )
    }

} )

module.exports = Markets