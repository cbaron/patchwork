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
        var valid = true,
            errorViews = [ ],
            targetErrorView = null
       
        Object.keys( this.itemViews ).forEach( id => {
            if( ! this.itemViews[id].valid ) {
                valid = false
                errorViews.push( this.itemViews[id].templateData.container )
                this.itemViews[id].templateData.container.addClass('has-error')
            }
        } )
           
        if( ! valid ) return false 

        Object.keys( this.itemViews ).forEach( id => this.items.get( id ).set( 'selectedDelivery', this.itemViews[id].selectedDelivery ) )
        
        if( errorViews.length ) {
            targetErrorView = errorViews.slice(-1)[0]
            this.$('html, body').animate( {
                scrollTop: targetErrorView.offset().top
            }, 500 )
        }

        if( ! valid ) return

        return true
    }
} )

module.exports = Delivery
