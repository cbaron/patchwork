var List = require('../util/List'),
    DeliveryOptions = function() { return List.apply( this, arguments ) }

Object.assign( DeliveryOptions.prototype, List.prototype, {

    ItemView: require('./DeliveryOption'),
    
    feedback: {
        home: require('../../templates/signup/homeDeliveryFeedback')( require('handlebars') )
    },

    getItemViewOptions() { return { container: this.templateData.options } },

    getTemplateOptions() { return this.model.attributes },

    homeFeedback() {
        this.zipRoute = new this.Model.extend( { urlRoot: "/zipcoderoute" } )()
        this.deliveryRoute = new this.Model.extend( { urlRoot: "/deliveryRoute" } )()

        this.zipRoute
            .fetch( { data: { zipcode: this.signupData.addressModel.postalCode } } )
            .done( () =>
                this.deliveryRoute
                    .set( { id: this.zipRoute.get('routeid') } )
                    .fetch()
                    .done( () => this.showFeedback( this.feedback.home( this.deliveryRoute.attributes ) ) )
            )

    },

    postRender() {
        var share = this.model

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

        this.on( 'itemSelected', model => this[ this.util.format('%sFeedback',this.model.get('name') ) ]() )
    },

    requiresLogin: false,

    selection: 'single',

    showFeedback( html ) {
        this.templateData.feedback.html( html ).show()
    },

    template: require('../../templates/signup/deliveryOptions')( require('handlebars') ),

} )

module.exports = DeliveryOptions
