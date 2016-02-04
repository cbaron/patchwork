var GetData = require('./util/GetData'),
    Markets = function() { return GetData.apply( this, arguments ) }

Object.assign( Markets.prototype, GetData.prototype, {

    dataTables: [
        { name: 'farmermarket', comparator: 'id'},
        { name: 'retailoutlet', comparator: 'id'},
        { name: 'restaurant', comparator: 'name'}
    ],

    requiresLogin: false,

    template: require('../templates/markets')( require('handlebars') ),

    templates: {
        farmermarket: require('../templates/business')( require('handlebars') ),
        retailoutlet: require('../templates/business')( require('handlebars') ),
        restaurant: require('../templates/restaurant')( require('handlebars') )
    }

} )

module.exports = Markets