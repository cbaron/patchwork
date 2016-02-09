var List = require('../util/List'),
    Delivery = function() { return List.apply( this, arguments ) }

Object.assign( Delivery.prototype, List.prototype, {

    ItemView: require('./DeliveryOptions'),

    events: {
    },

    getItemViewOptions() {
        return { container: this.templateData.options }
    },
    
    itemModels() { return this.signupData.shares },

    requiresLogin: false,

    selection: 'single',

    template: require('../../templates/signup/delivery')( require('handlebars') ),

    validate() {
        var selectedShares = Object.keys( this.selectedItems ).map( id => this.items.get(id) )
        if( selectedShares.length === 1 ) {
            this.signupData.delivery = selectedShares[0]
            return true
        }
        this.templateData.container.addClass('has-error')
    }

} )

module.exports = Delivery
