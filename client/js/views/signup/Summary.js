var View = require('../MyView'),
    Summary = function() { return View.apply( this, arguments ) }

Object.assign( Summary.prototype, View.prototype, {

    getTemplateOptions() {
        console.log( this.signupData.shares.map( share => share.attributes ) )
        return {
            shares: this.signupData.shares.map( share => share.attributes )
        }
    },

    requiresLogin: false,

    subviews: {
        paymentOptions: [
            { name: 'paymentOptions', view: require('./PaymentOptions') },
        ],
    },

    template: require('../../templates/signup/summary')( require('handlebars') )

} )

module.exports = Summary
