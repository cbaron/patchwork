var CustomContent = require('./util/CustomContent'),
    CSA = function() { return CustomContent.apply( this, arguments ) }

Object.assign( CSA.prototype, CustomContent.prototype, {

    Models: {
        DeliveryRoute: require('../models/DeliveryRoute') 
    },

    events: {
        signupBtn: { method: 'routeToSignup' }
    },

    hashToElement: {
        'how-do-i-know': 'howDoIKnow',
    },

    parseDeliveryInfo: require('../models/DeliveryRoute').prototype.parse,

    postRender() {
        CustomContent.prototype.postRender.call(this)

        if( window.location.hash ) {
            this.$('body').animate( {
                scrollTop: this.templateData[ this.hashToElement[ window.location.hash.slice(1) ] ].position().top }, 1000 )
        }

        this.on( 'insertedcsainfoTemplate', () => {

            this.Xhr( { method: 'get', resource: 'currentGroupDelivery' } )
            .then( data =>
                data.forEach( datum =>
                    this.slurpTemplate( {
                        template: this.templates.groupDeliveryOption( ( new this.Models.DeliveryRoute( datum, { parse: true } ) ).attributes ),
                        insertion: { $el: this.templateData.groupDeliveryOptions }
                    } )
                )
            )
            .catch( e => new this.Error(e) )

            this.Xhr( { method: 'get', resource: 'currentFarmDelivery' } )
            .then( data => 
                this.slurpTemplate( {
                    template: this.templates.farmDeliveryOption( ( new this.Models.DeliveryRoute( data, { parse: true } ) ).attributes ),
                    insertion: { $el: this.templateData.farmPickupOption }
                } )
            )
            .catch( e => new this.Error(e) )

            this.Xhr( { method: 'get', resource: 'currentShare' } )
            .then( ( { deliveryOptions, produceOptions } ) => {

                this.slurpTemplate( {
                    template: this.templates.deliveryMatrix( { deliveryOptions, sizeOptions: produceOptions.filter( option => /size/i.test( option.prompt ) ) } ),
                    insertion: { $el: this.templateData.deliveryMatrix }
                } )

                this.slurpTemplate( {
                    template: this.templates.nonSizeOptions( { options: produceOptions.filter( option => (!/size/i.test( option.prompt )) && option.label === "1" ) } ),
                    insertion: { $el: this.templateData.nonSizeOptions }
                } )

                const homeDelivery = deliveryOptions.find( option => option.name === 'home' )
                if( homeDelivery ) this.templateData.homeDeliveryIntro.text( this.templateData.homeDeliveryIntro.text().replace( /\$[\d\.]*/, `${homeDelivery.price}` ) )
            
            } )
            .catch( e => new this.Error(e) )
        } )
    },

    requiresLogin: false,

    tables: [
        { name: 'csacustomization', el: 'customize', template: 'csaCustomization' },
        { name: 'csainfo', el: 'how', template: 'csaHow' },
        { name: 'csastatements', comparator: 'position', el: 'csaStatements', template: 'listItem'},
        { name: 'largeshareexample', comparator: 'position', el: 'shareExample', template: 'listItemTwoCol' },
    ],
    
    routeToSignup() { this.router.navigate( "sign-up", { trigger: true } ) },

    template: () => require('../templates/csa'),

    templates: {
        csaCustomization: require('../templates/csaCustomization'),
        csaHow: require('../templates/csaHow'),
        deliveryMatrix: require('../templates/deliveryMatrix'),
        farmDeliveryOption: require('../templates/farmDeliveryOption'),
        groupDeliveryOption: require('../templates/groupDeliveryOption'),
        listItem: require('../templates/listItem')( require('handlebars') ),
        listItemTwoCol: require('../templates/listItemTwoCol')( require('handlebars') ),
        nonSizeOptions: require('../templates/nonSizeOptions'),
    }

} )

module.exports = CSA
