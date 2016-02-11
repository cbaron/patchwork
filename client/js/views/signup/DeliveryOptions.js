var List = require('../util/List'),
    DeliveryOptions = function() { return List.apply( this, arguments ) }

Object.assign( DeliveryOptions.prototype, List.prototype, {

    ItemView: require('./DeliveryOption'),

    Models: {
        DeliveryRoute: require('../../models/DeliveryRoute')
    },

    Views: {
        Dropoffs: require('./Dropoffs')
    },

    farmFeedback() {
        this.farmPickup = new ( this.Models.DeliveryRoute.extend( { parse: response => this.Models.DeliveryRoute.prototype.parse( response[0] ) } ) )()
        this.farmPickup.fetch( { data: { label: 'farm' } } ).done( () => {
            if( Object.keys( this.farmPickup.attributes ).length === 0 ) {
                this.valid = false
                return this.showFeedback( this.feedback.noFarmRoute() )
            }
            this.showFeedback( this.feedback.home( this.farmPickup.attributes ) ) 
        } )
    },
    
    feedback: {
        home: require('../../templates/signup/homeDeliveryFeedback')( require('handlebars') ),
        invalidZip: function( zipcode ) {
            return this.util.format( 'Postal Code of %s is not in our delivery area.  Please contact us to discuss options', zipcode )
        },
        noFarmRoute: function() { return "There is currently an error with On-Farm Pickup selection" }
    },

    getItemViewOptions() { return { container: this.templateData.options } },

    getTemplateOptions() { return this.model.attributes },

    groupFeedback() {
        this.dropoffIds.fetch( { data: { shareid: this.model.id } } ).done( () => {
            if( ! this.dropoffIds.length ) { this.valid = false; return }
            this.dropoffs.fetch( { data: { id: this.dropoffIds.map( model => model.get('groupdropoffid') ).join(',') } } ).done( () => {
                this.dropoffView = new this.Views.Dropoffs( { itemModels: dropoffs.models, container: this.templateData.feedback } )
            } )
        } )
    },

    homeFeedback() {
        this.zipRoute = new ( this.Model.extend( { parse: response => response[0], urlRoot: "/zipcoderoute" } ) )()
        this.homeDeliveryRoute = new this.Models.DeliveryRoute()

        this.zipRoute
            .fetch( { data: { zipcode: this.signupData.addressModel.postalCode } } )
            .done( () => {
                if( Object.keys( this.zipRoute.attributes ).length === 0 ) {
                    this.valid = false
                    return this.showFeedback( this.feedback.invalidZip.call( this, this.signupData.addressModel.postalCode ) )
                }    
                this.homeDeliveryRoute.set( { id: this.zipRoute.get('routeid') } )
                .fetch()
                .done( () => this.showFeedback( this.feedback.home( this.homeDeliveryRoute.attributes ) ) )
            } )
    },

    postRender() {
        var share = this.model

        this.dropoffIds = new ( this.Collection.extend( { url: "/sharegroupdropoff" } ) )(),
        this.dropoffs = new ( this.Collection.extend( { url: "/groupdropoff" } ) )()

        List.prototype.postRender.call( this )

        share.set( { deliveryoptionids: new ( this.Collection.extend( { url: "/sharedeliveryoption" } ) )() } )
        share.get('deliveryoptionids').fetch( { data: { shareid: share.id } } ).done( () => {
            if( share.get('deliveryoptionids') ) {
                share.set( { deliveryoptions: new ( this.Collection.extend( { url: "/deliveryoption" } ) )() } )
                share.get('deliveryoptions')
                    .fetch( { data: { id: share.get('deliveryoptionids').map( sharedeliveryoption => sharedeliveryoption.get('deliveryoptionid') ).join(',') } } )
                    .done( () => this.items.reset( share.get('deliveryoptions').models ) )
                    .fail( e => console.log( e.stack || e ) ) 
            }
        } )

        this.on( 'itemSelected', model => this[ this.util.format('%sFeedback',model.get('name') ) ]() )
        this.on( 'itemUnselected', () => this.templateData.feedback.empty() )
    },

    requiresLogin: false,

    selection: 'single',

    showFeedback( html ) {
        this.templateData.feedback.html( html ).show()
    },

    template: require('../../templates/signup/deliveryOptions')( require('handlebars') ),

} )

module.exports = DeliveryOptions