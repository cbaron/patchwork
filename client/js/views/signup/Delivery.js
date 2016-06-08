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
            homeDeliverySelected = false,
            addressModel = this.user.get('addressModel'),
            postalCode =  ( addressModel && addressModel.postalCode ) ? addressModel.postalCode : undefined,
            deferred = this.Q.defer()
       
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

        if( ! valid ) return false

        if( homeDeliverySelected && this.user.get('customAddress') ) {
            this.modalView.show( {
                body: this.templates.verifyAddress( { address: this.user.get('address'), zipCode: postalCode } ),
                title: 'Verify Adress' } )
            .on( 'hidden', () => {

                Object.keys( this.itemViews ).forEach( id => {
                    var selectedDelivery = this.items.get( id ).get( 'selectedDelivery' )
                    if( !selectedDelivery.dayofweek || !selectedDelivery.starttime || !selectedDelivery.endtime ) deferred.reject()
                } )

                deferred.resolve()
            } )
            .on( 'submit', data => {
                
                this.$('#zipCodeFormGroup').removeClass('has-error')
                this.$('#zipCodeHelpBlock').addClass('hide')

                this.user.set( {
                    address: data.verifiedAddress,
                    addressModel: Object.assign( this.user.get('addressModel') || {} , { postalCode: data.verifiedZipCode, types: [ "street_address" ]  } ),
                    customAddress: false
                }, { silent: true } )
                this.Q( this.$.ajax( {
                    data: JSON.stringify( this.user.attributes ),
                    method: "PATCH",
                    url: "/user" } ) )
                .then( () => {
                    var zipRoute = new ( this.Model.extend( { parse: response => response[0], urlRoot: "/zipcoderoute" } ) )(),
                        homeDeliveryRoute = new this.Models.DeliveryRoute()

                    zipRoute.fetch( { data: { zipcode: this.user.get('addressModel').postalCode } } )
                        .done( () => {
                            if( Object.keys( zipRoute.attributes ).length === 0 ) {
                                this.$('#zipCodeFormGroup').addClass('has-error')
                                this.$('#zipCodeHelpBlock').removeClass('hide')
                            }    
                            homeDeliveryRoute.set( { id: this.zipRoute.get('routeid') } ).fetch()
                            .done( () => {
                                 Object.keys( this.itemViews ).forEach( id => {
                                    if( this.itemViews[id].selectedDelivery.isHome ) {
                                        this.items.get( id ).set( 'selectedDelivery',
                                            Object.assign( this.itemViews[id].selectedDelivery, homeDeliveryRoute.pick( [ 'dayofweek', 'starttime', 'endtime' ] ) ) )
                                    }
                                 } )
                                this.modalView.templateData.container.modal('hide')
                            } )
                        } )
                } )
                .then( deferred.resolve )
                .fail( deferred.reject ).done()
            } )

            return deferred.promise
        }

        return true
    }
} )

module.exports = Delivery
