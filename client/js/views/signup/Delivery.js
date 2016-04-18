var List = require('../util/List'),
    Delivery = function() { return List.apply( this, arguments ) }

Object.assign( Delivery.prototype, List.prototype, {

    ItemView: require('./DeliveryOptions'),

    collection: { comparator: 'startEpoch' },

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

    templates: {
        verifyAddress: require('../../templates/signup/verifyAddress')( require('handlebars') )
    },

    validate() {
        var valid = true,
            errorViews = [ ],
            targetErrorView = null,
            homeDeliverySelected = false
       
        Object.keys( this.itemViews ).forEach( id => {
            if( ! this.itemViews[id].valid ) {
                valid = false
                errorViews.push( this.itemViews[id].templateData.container )
                this.itemViews[id].templateData.container.addClass('has-error')
            }
        } )
           
        if( ! valid ) return false 

        Object.keys( this.itemViews ).forEach( id => {
            this.items.get( id ).set( 'selectedDelivery', this.itemViews[id].selectedDelivery )
            if( this.itemViews[id].selectedDelivery.isHome ) homeDeliverySelected = true
        } )
        
        if( errorViews.length ) {
            targetErrorView = errorViews.slice(-1)[0]
            this.$('html, body').animate( {
                scrollTop: targetErrorView.offset().top
            }, 500 )
        }

        if( ! valid ) return

        if( homeDeliverySelected && this.user.get('customAddress') ) {
            this.modalView.show( {
                body: this.templates.verifyAddress( { address: this.user.get('address'), zipCode: this.user.get('addressModel').postalCode } ),
                hideCancelBtn: true,
                static: true,
                title: 'Verify Adress' } )
            .on( 'submit', data => {
                this.user.set( {
                    address: data.verifiedAddress,
                    addressModel: Object.assign( this.user.get('addressModel'), { postalCode: data.verifiedZipCode, types: [ "street_address" ]  } ),
                    customAddress: false
                }, { silent: true } )
                this.Q( this.$.ajax( {
                    data: JSON.stringify( this.user.attributes ),
                    method: "PATCH",
                    url: "/user" } ) )
                this.modalView.templateData.container.modal('hide')
            } )
        }

        return true
    }
} )

module.exports = Delivery
