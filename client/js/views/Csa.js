module.exports = Object.assign( {}, require('./__proto__'), require('./util/CustomContent'), {

    CurrentShare: require('../models/CurrentShare'),
    Shares: Object.create( require('../models/__proto__'), { resource: { value: 'CsaPageShare' } } ),
    ShareOptions: Object.create( require('../models/__proto__'), { resource: { value: 'shareoption' } } ),

    events: {
        signupBtn: 'click'
    },

    hashToElement: {
        'how-do-i-know': 'howDoIKnow',
    },

    insertAddOnDescriptions() {
        this.ShareOptions.data.filter( opt => opt.name !== 'Share size' ).forEach( shareOpt => {
            const addOnInfo = this.CurrentShare.data.produceOptions.find( produceOpt => produceOpt.shareoptionid === shareOpt.id && produceOpt.name === 'one' )

            if( !addOnInfo ) return

            this.slurpTemplate( {
                template: this.templates.csaItem( Object.assign( addOnInfo, { heading: shareOpt.name } ) ),
                insertion: { el: this.els.addOnItems }
            } )
        } )

        if( !this.els.addOnItems.children.length ) this.els.addOns.classList.add('fd-hidden')
    },

    insertDeliveryMatrix() {
        this.slurpTemplate( {
            template: this.templates.deliveryMatrix( {
                deliveryOptions: this.CurrentShare.data.deliveryOptions,
                sizeOptions: this.CurrentShare.getSizeOptions()
            } ),
            insertion: { el: this.els.deliveryMatrix }
        } )
    },

    insertShareDescription( share ) {
        const deliveryOpts = this.CurrentShare.data.deliveryOptions,
            sharePrice = parseFloat( this.CurrentShare.data.produceOptions.find( opt => opt.prompt = 'Share size' && share.name === opt.name ).price.replace('$','') ),
            lowPrice = sharePrice + parseFloat( this.CurrentShare.data.deliveryOptions[0].price.replace('$','') ),
            highPrice = sharePrice + parseFloat( this.CurrentShare.data.deliveryOptions[ this.CurrentShare.data.deliveryOptions.length - 1 ].price.replace('$','') ),
            priceRange = lowPrice === highPrice ? `$${lowPrice.toFixed(2)}` : `$${lowPrice.toFixed(2)} - $${highPrice.toFixed(2)}`

        this.slurpTemplate( {
            template: this.templates.csaItem( Object.assign( share.shareDescription, { price: priceRange } ) ),
            insertion: { el: this.els.shareDescriptions }
        } )
    },

    insertShareExample( share ) {
        this.slurpTemplate( {
            template: this.templates.shareExample( share.shareExample ),
            insertion: { el: this.els.shareExamples }
        } )
    },

    onSignupBtnClick() { this.emit( 'navigate', 'sign-up' ) },

    postRender() {
        require('./util/CustomContent').postRender.call(this)

        if( window.location.hash ) {
            this.els[ this.hashToElement[ window.location.hash.slice(1) ] ].scrollIntoView( { behavior: 'smooth' } )
        }

        Promise.all( [ this.CurrentShare.get(), this.Shares.get(), this.ShareOptions.get() ] )
        .then( () => {
            this.insertDeliveryMatrix()

            this.Shares.data.forEach( share => {
                this.insertShareExample( share )
                this.insertShareDescription( share )
            } )

            this.insertAddOnDescriptions()
        } )
        .catch( this.Error )

        return this
    },

    templates: {
        csaItem: require('./templates/CsaItem'),
        deliveryMatrix: require('./templates/deliveryMatrix'),
        shareExample: require('./templates/ShareExample')
    }

} )