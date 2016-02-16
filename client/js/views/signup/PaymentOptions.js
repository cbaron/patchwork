var List = require('../util/List'),
    PaymentOptions = function() { return List.apply( this, arguments ) }

Object.assign( PaymentOptions.prototype, List.prototype, {

    ItemView: require('./PaymentOption'),

    itemModels: [
        { id: 1, name: 'cash', label: 'Cash or Check', note: 'Mail payment to Patchwork' },
        { id: 2, name: 'card', label: 'Credit Card', note: 'A 3% fee will apply.' }
    ],

    requiresLogin: false,

    selection: 'single',

    template: require('../../templates/signup/paymentOptions')( require('handlebars') )
} )

module.exports = PaymentOptions
