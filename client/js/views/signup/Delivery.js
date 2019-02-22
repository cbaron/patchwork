var List = require('../util/List'),
    Delivery = function() { return List.apply( this, arguments ) }

Object.assign( Delivery.prototype, List.prototype, {

    ItemView: require('./DeliveryOptions'),

    Models: {
        DeliveryRoute: require('../../models/DeliveryRoute'),
    },

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

    template: require('../../templates/signup/delivery'),

    templates: {
        verifyAddress: require('../../templates/signup/verifyAddress')
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
            this.items.get( id ).set( 'selectedDelivery', Object.assign( {}, this.itemViews[id].selectedDelivery ) )
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
                body: this.templates.verifyAddress( { address: this.user.get('address'), zipCode: postalCode || '' } ),
                title: 'Verify Adress' } )
            .on( 'hidden', () => {

                Object.keys( this.itemViews ).forEach( id => {
                    var selectedDelivery = this.items.get( id ).get( 'selectedDelivery' )
                    if( !selectedDelivery.dayofweek || !selectedDelivery.starttime || !selectedDelivery.endtime ) deferred.reject()
                } )

                deferred.resolve()
            } )
            .on( 'submit', () => {
                var zipRoute = new ( this.Model.extend( { parse: response => response[0], urlRoot: "/zipcoderoute" } ) )(),
                    homeDeliveryRoute = new this.Models.DeliveryRoute(),
                    userAttributes

                this.$('#zipCodeFormGroup').removeClass('has-error')
                this.$('#zipCodeHelpBlock').addClass('hide')
                
                if( ! this.$('#verifiedZipCode').val().length ) {
                    this.$('#zipCodeFormGroup').addClass('has-error')
                    this.$('#zipCodeHelpBlock').removeClass('hide')
                    return
                }

                this.Q( zipRoute.fetch( { data: { zipcode: this.$('#verifiedZipCode').val() } } ) )
                .then( () => {
                    if( Object.keys( zipRoute.attributes ).length === 0 ) {
                        this.$('#zipCodeFormGroup').addClass('has-error')
                        this.$('#zipCodeHelpBlock').removeClass('hide')
                        return
                    }    

                    return this.Q( homeDeliveryRoute.set( { id: zipRoute.get('routeid') } ).fetch() )
                    .then( () => {
                        Object.keys( this.itemViews ).forEach( id => {
                            var selectedDelivery = Object.assign( {}, this.itemViews[id].selectedDelivery, homeDeliveryRoute.pick( [ 'dayofweek', 'starttime', 'endtime' ] ) )
                            if( this.itemViews[id].selectedDelivery.isHome ) {
                                this.items.get( id ).set( 'selectedDelivery', selectedDelivery )
                                this.itemViews[id].selectedDelivery = selectedDelivery
                                this.itemViews[id].showFeedback( this.itemViews[id].feedback.home( selectedDelivery ) )
                            }
                        } )

                        userAttributes = Object.assign( {}, this.user.attributes, {
                            address: this.$('#verifiedAddress').val(),
                            addressModel: Object.assign( this.user.get('addressModel') || {} , { postalCode: this.$('#verifiedZipCode').val(), types: [ "street_address" ]  } ),
                            customAddress: false
                        } )

                        return this.Q( this.$.ajax( { data: JSON.stringify( userAttributes ), method: "PATCH", url: "/user" } ) )
                    } ).then( () => {
                        this.user.set( userAttributes, { silent: true } )
                        this.modalView.templateData.container.modal('hide')
                        deferred.resolve(true)
                    } )
                } )
                .fail( e => {
                    console.log(e.stack || e);
                    deferred.reject(e)
                } )
                .done()
                
            } )
                
            return deferred.promise

        }

        return true
    }
} )

module.exports = Delivery
