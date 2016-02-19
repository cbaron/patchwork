var List = require('../util/List'),
    Delivery = function() { return List.apply( this, arguments ) }

Object.assign( Delivery.prototype, List.prototype, {

    ItemView: require('./DeliveryOptions'),

    getItemViewOptions() { return { container: this.templateData.shares, signupData: this.signupData } },
    
    itemModels() { return this.signupData.shares.models },

    postRender() {
        List.prototype.postRender.call(this)

        this.signupData.shares
            .on( 'add', share => this.items.add( share ) )
            .on( 'remove', share => this.items.remove( share ) )

    },

    requiresLogin: false,

    template: require('../../templates/signup/delivery')( require('handlebars') ),

    validate() {
        var valid = true
       
        Object.keys( this.itemViews ).forEach( id => {
            if( ! this.itemViews[id].valid ) {
                valid = false
                this.itemViews[id].templateData.container.addClass('has-error')
            }
        } )

        if( ! valid ) return

        this.signupData.shares.forEach( share => share.set( 'selectedDeliveryDayOfWeek', share.get('selectedDelivery').dayofweek ) )

        return true

    }

} )

module.exports = Delivery
