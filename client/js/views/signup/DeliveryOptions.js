var List = require('../util/List'),
    DeliveryOptions = function() { return List.apply( this, arguments ) }

Object.assign( DeliveryOptions.prototype, List.prototype, {

    calculateOptionCost( model ) {
        var duration = this.model.get('duration'),
            weeklyCost = model.get('price'),
            weeklyCostFloat = ( model.get('price').charAt(0) === "-" ) ? parseFloat( "-" + weeklyCost.slice(2) ) : parseFloat( weeklyCost.slice(1) ),
            optionTotalCost = ( weeklyCostFloat * duration )
        
        /*
        Object.assign( this.selectedDelivery, {
            weeklyCost: weeklyCostFloat,
            weeklyCostString: weeklyCostFloat.toFixed(2),
            totalCost: optionTotalCost,
            totalCostString: optionTotalCost.toFixed(2) 
        } )
        */

        var sharePlusDelivery = this.model.get('weeklyShareOptionsTotal') + weeklyCostFloat
        this.model.set( 'shareOptionsPlusDelivery', sharePlusDelivery.toFixed(2) )
        
    },

    ItemView: require('./DeliveryOption'),

    Models: {
        DeliveryRoute: require('../../models/DeliveryRoute'),
        Dropoff: require('../../models/Dropoff')
    },

    Views: {
        Dropoffs: require('./Dropoffs')
    },

    farmFeedback( model ) {
        this.farmPickup = new ( this.Models.DeliveryRoute.extend( { parse: response => this.Models.DeliveryRoute.prototype.parse( response[0] ) } ) )()
        this.farmPickup.fetch( { data: { label: 'farm' } } ).done( () => {
            if( Object.keys( this.farmPickup.attributes ).length === 0 ) {
                this.valid = false
                return this.showFeedback( this.feedback.noFarmRoute() )
            }
            
            this.showFeedback( this.feedback.farm( this.farmPickup.attributes ) )

            //Object.assign( this.selectedDelivery, { deliveryoptionid: model.id }, this.farmPickup.attributes )
            this.selectedDelivery = { deliveryoptionid: model.id, dayofweek: this.farmPickup.get('dayofweek') }

            this.valid = true
        } )
    },
    
    feedback: {
        home: require('../../templates/signup/homeDeliveryFeedback')( require('handlebars') ),
        farm: require('../../templates/signup/farmPickupFeedback')( require('handlebars') ),
        invalidZip: function( zipcode ) {
            return this.util.format( 'Postal Code of %s is not in our delivery area.  Please contact us to discuss options.', zipcode )
        },
        noFarmRoute: function() { return "There is currently an error with On-Farm Pickup selection." }
    },

    getItemViewOptions() { return { container: this.templateData.options } },

    getTemplateOptions() { return this.model.attributes },

    groupFeedback( deliveryOption ) {
        this.dropoffIds.fetch( { data: { shareid: this.model.id } } ).done( () => {
            if( ! this.dropoffIds.length ) { this.valid = false; return }
            this.dropoffs.fetch( { data: { id: this.dropoffIds.map( model => model.get('groupdropoffid') ).join(',') } } ).done( () => {
                this.dropoffs.forEach( model => { 
                    model.set( { dayofweek: this.dropoffIds.find( dropoff => dropoff.get('groupdropoffid') == model.id ).get('dayofweek') } )
                    
                    var starttime = this.dropoffIds.find( dropoff => dropoff.get('groupdropoffid') == model.id ).get('starttime')
                    model.set( { starttime: this.moment( [ this.moment().format('YYYY-MM-DD'), starttime ].join(' ') ).format('hA') } )

                    var endtime = this.dropoffIds.find( dropoff => dropoff.get('groupdropoffid') == model.id ).get('endtime')
                    model.set( { endtime: this.moment( [ this.moment().format('YYYY-MM-DD'), endtime ].join(' ') ).format('hA') } )
                    
                } )

                this.dropoffView = new this.Views.Dropoffs( { container: this.templateData.feedback } )
                .on( 'itemUnselected', () => {
                    this.dropoffView.itemViews.forEach( view => {
                        if( view.templateData.container.is(':hidden') ) view.templateData.container.show()
                    })

                    this.valid = false 
                } )
                .on( 'itemSelected', model => {
                    var selectedId = model.id
                    this.dropoffs.models.forEach( model => {
                        if( model.id !== selectedId ) this.dropoffView.itemViews[ model.id ].templateData.container.hide()
                    } )

                    this.selectedDelivery = { deliveryoptionid: deliveryOption.id, groupdropoffid: model.id, dayofweek: model.get('dayofweek') }
                    
                    this.valid = true
                } )
                .on( 'itemAdded', model => {
                    var selectedDelivery = this.model.get('selectedDelivery')
                    if( selectedDelivery &&
                        Object.keys( this.dropoffView.itemViews ).length == this.dropoffView.items.length &&
                        this.dropoffView.itemViews[ selectedDelivery.groupdropoffid ] ) {
                        
                        this.dropoffView.selectItem( this.dropoffView.items.get( selectedDelivery.groupdropoffid ) )
                    }
                } )

                this.dropoffView.items.reset( this.dropoffs.models )
            } )
        } )
    },

    homeFeedback( deliveryOption ) {

        var userPostalCode = this.user.get('addressModel').postalCode

        this.zipRoute = new ( this.Model.extend( { parse: response => response[0], urlRoot: "/zipcoderoute" } ) )()
        this.homeDeliveryRoute = new this.Models.DeliveryRoute()

        this.zipRoute
            .fetch( { data: { zipcode: userPostalCode } } )
            .done( () => {
                if( Object.keys( this.zipRoute.attributes ).length === 0 ) {
                    this.valid = false
                    return this.showFeedback( this.feedback.invalidZip.call( this, userPostalCode ) )
                }    
                this.homeDeliveryRoute.set( { id: this.zipRoute.get('routeid') } )
                .fetch()
                .done( () => {
                    this.showFeedback( this.feedback.home( this.homeDeliveryRoute.attributes ) )
                    
                    this.selectedDelivery = { deliveryoptionid: deliveryOption.id, dayofweek: this.homeDeliveryRoute.get('dayofweek') }
                    
                    this.valid = true
                } )
            } )
    },

    postRender() {
        
        var share = this.model

        this.dropoffIds = new ( this.Collection.extend( { url: "/sharegroupdropoff" } ) )(),
        this.dropoffs = new ( this.Collection.extend( { model: this.Models.Dropoff, url: "/groupdropoff" } ) )()
        
        this.selection = 'single'

        List.prototype.postRender.call( this )

        share.set( { deliveryoptionids: new ( this.Collection.extend( { url: "/sharedeliveryoption" } ) )() } )
        share.get('deliveryoptionids').fetch( { data: { shareid: share.id } } ).done( () => {
            if( share.get('deliveryoptionids').length ) {
                share.set( { deliveryoptions: new ( this.Collection.extend( { url: "/deliveryoption" } ) )() } )
                share.get('deliveryoptions')
                    .fetch( { data: { id: share.get('deliveryoptionids').map( sharedeliveryoption => sharedeliveryoption.get('deliveryoptionid') ).join(',') } } )
                    .done( () => this.items.reset( share.get('deliveryoptions').models ) )
                    .fail( e => console.log( e.stack || e ) ) 
            } else {
                this.templateData.options.text('This share does not have delivery options associated with it.  Please contact Patchwork and sign up for this particular share at  a later date.')
            }
        } )

        this.on( 'itemAdded', model => {
            var price = parseFloat( model.get('price').replace(/\$|,/g, "") ),
                selectedDelivery = this.model.get('selectedDelivery')
            
            if( price == 0 ) this.itemViews[ model.id ].templateData.deliveryPrice.text( "No charge" )
            else if( price < 0 ) this.itemViews[ model.id ].templateData.deliveryPrice.text( this.util.format('Save %s per week', model.get('price').replace('-','') ) )

            if( selectedDelivery && selectedDelivery.deliveryoptionid == model.id ) this.selectItem( model )
        } )

        this.on( 'itemSelected', model => {
            this.templateData.container.removeClass('has-error')
            this.calculateOptionCost( model )
            this[ this.util.format('%sFeedback', model.get('name') ) ]( model )            
        } )
        .on( 'itemUnselected', () => {
            this.valid = false
            this.templateData.feedback.empty()
        } )

    },

    requiresLogin: false,

    showFeedback( html ) {
        this.templateData.feedback.html( html ).show()
    },

    template: require('../../templates/signup/deliveryOptions')( require('handlebars') )
} )

module.exports = DeliveryOptions
