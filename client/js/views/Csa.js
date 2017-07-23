module.exports = Object.assign( {}, require('./__proto__'), require('./util/CustomContent'), {

    Models: {
        DeliveryRoute: require('../models/DeliveryRoute') 
    },

    events: {
        signupBtn: 'click'
    },

    hashToElement: {
        'how-do-i-know': 'howDoIKnow',
    },

    parseDeliveryInfo: require('../models/DeliveryRoute').prototype.parse,

    onSignupBtnClick() { this.emit( 'navigate', 'sign-up' ) },

    postRender() {
        require('./util/CustomContent').postRender.call(this)

        this.on( 'insertedcsainfoTemplate', () => {

            if( window.location.hash ) {
                this.els[ this.hashToElement[ window.location.hash.slice(1) ] ].scrollIntoView( { behavior: 'smooth' } )
            }

            this.Xhr( { method: 'get', resource: 'currentGroupDelivery' } )
            .then( data =>
                data.forEach( datum =>
                    this.slurpTemplate( {
                        template: this.templates.groupDeliveryOption( ( new this.Models.DeliveryRoute( datum, { parse: true } ) ).attributes ),
                        insertion: { el: this.els.groupDeliveryOptions }
                    } )
                )
            )
            .catch( e => new this.Error(e) )

            this.Xhr( { method: 'get', resource: 'currentFarmDelivery' } )
            .then( data => 
                this.slurpTemplate( {
                    template: this.templates.farmDeliveryOption( ( new this.Models.DeliveryRoute( data, { parse: true } ) ).attributes ),
                    insertion: { el: this.els.farmPickupOption }
                } )
            )
            .catch( e => new this.Error(e) )

            this.Xhr( { method: 'get', resource: 'currentShare' } )
            .then( ( { deliveryOptions, produceOptions } ) => {

                this.slurpTemplate( {
                    template: this.templates.deliveryMatrix( { deliveryOptions, sizeOptions: produceOptions.filter( option => /size/i.test( option.prompt ) ) } ),
                    insertion: { el: this.els.deliveryMatrix }
                } )

                this.slurpTemplate( {
                    template: this.templates.nonSizeOptions( { options: produceOptions.filter( option => (!/size/i.test( option.prompt )) && option.label === "1" ) } ),
                    insertion: { el: this.els.nonSizeOptions }
                } )

                const homeDelivery = deliveryOptions.find( option => option.name === 'home' )
                if( homeDelivery ) this.els.homeDeliveryIntro.textContent = this.els.homeDeliveryIntro.textContent.replace( /\$[\d\.]*/, `${homeDelivery.price}` )
            
            } )
            .catch( e => new this.Error(e) )
        } )

        return this
    },

    tables: [
        { name: 'csacustomization', el: 'customize', template: 'csaCustomization' },
        { name: 'csainfo', el: 'how', template: 'csaHow' },
        { name: 'csastatements', el: 'csaStatements', template: 'listItem'},
        { name: 'largeshareexample', el: 'shareExampleLg', template: 'listItem' },
        { name: 'smallShareExample', el: 'shareExampleSm', template: 'listItem' },
    ],

    templates: {
        csaCustomization: require('../templates/csaCustomization'),
        csaHow: require('../templates/csaHow'),
        deliveryMatrix: require('../templates/deliveryMatrix'),
        farmDeliveryOption: require('../templates/farmDeliveryOption'),
        groupDeliveryOption: require('../templates/groupDeliveryOption'),
        listItem: require('./templates/ListItem'),
        nonSizeOptions: require('../templates/nonSizeOptions'),
        shareExample: require('./templates/ShareExample')
    }

} )
