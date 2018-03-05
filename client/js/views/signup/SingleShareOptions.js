var List = require('../util/List'),
    SingleShareOptions = function() { return List.apply( this, arguments ) }

Object.assign( SingleShareOptions.prototype, List.prototype, {

    SeasonalAddOn: Object.create( require('../../models/__proto__'), { resource: { value: 'seasonalAddOn' } } ),
    SeasonalAddOnOption: Object.create( require('../../models/__proto__'), { resource: { value: 'seasonalAddOnOption' } } ),

    ItemView: require('./ShareOption'),

    getItemViewOptions() {
        return {
            container: this.templateData.options,
            share: this.model
        }
    },

    getTemplateOptions() { return this.model.attributes },

    insertSeasonalOptions() {
        Promise.all( [ this.SeasonalAddOn.get(), this.SeasonalAddOnOption.get() ] )
        .then( () => {
            this.seasonalAddOns = this.SeasonalAddOn.data.filter( addon => addon.shareid === this.model.id )

            if( !this.seasonalAddOns.length ) {
                this.templateData.seasonalContainer.get(0).classList.add('fd-hidden')
                this.templateData.seasonalTotal.get(0).parentNode.classList.add('fd-hidden')
            }

            this.seasonalAddOns.forEach( addon => {
                const options = this.SeasonalAddOnOption.data.filter( option => option.seasonalAddOnId === addon.id )

                this.slurpTemplate( {
                    insertion: { $el: this.templateData.seasonalOptions },
                    template: this.Templates.SeasonalAddOn( { name: addon.name, label: addon.label, options } )
                } )

                this.templateData[ addon.name ].on( 'change', () => this.updateSeasonalTotal() )
            } )

            if( this.model.get('seasonalAddOns') && this.model.get('seasonalAddOns').length ) {
                this.model.get('seasonalAddOns').forEach( selectedAddon => {
                    this.templateData[ selectedAddon.name ].val( selectedAddon.seasonalAddOnOptionId )
                    this.updateSeasonalTotal()
                } )
            }
        } )
        .catch( e => console.log( e.stack || e ) )
    },

    postRender() {
        
        var share = this.model
        
        List.prototype.postRender.call( this )

        this.insertSeasonalOptions()

        this.on( 'itemAdded', shareOption => {
            this.itemViews[ shareOption.id ].on( 'changed', () => this.updateTotal() )

            if( share.get('selectedOptions') ) {
                share.get('selectedOptions').forEach( selectedOption => {
                    if( selectedOption.shareoptionid == shareOption.id ) {
                        this.itemViews[ shareOption.id ].templateData.input.val( selectedOption.shareoptionoptionid )
                    }
                } )
            }

            if( Object.keys( this.itemViews ).length == this.items.length ) {
                Object.keys( this.itemViews ).forEach( key => this.itemViews[ key ].updateTotal() )
                this.updateTotal()
            }
        } )

        this.factory.create( 'shareBox', { insertion: { el: this.templateData.shareBox.get(0) }, model: share } )

        //TODO: Write UI when no options exist.
        this.model.getShareOptions()
            .then( () => share.get('shareoptions').forEach( shareoption => this.items.add( shareoption ) ) )
            .fail( e => console.log( e.stack || e ) )

    },

    requiresLogin: false,

    template: require('../../templates/signup/singleShareOptions'),

    Templates: {
        SeasonalAddOn: require('../templates/SeasonalAddOn')
    },

    updateSeasonalTotal() {
        let seasonalTotal = 0

        this.seasonalAddOns.forEach( addon => {
            const selectedOption = this.SeasonalAddOnOption.data.find( option => option.id == this.templateData[ addon.name ].val() && option.seasonalAddOnId === addon.id ),
                optionPrice = parseFloat( selectedOption.price.replace(/\$|,/g, "") )

            seasonalTotal += optionPrice
            this.templateData[ `${addon.name}Total` ].text( `$${optionPrice.toFixed(2)} for the season` )
        } )

        this.templateData.seasonalTotal.text( `$${seasonalTotal.toFixed(2)} for the season`)
    },

    updateTotal() {
        var total =
            this.items.map( shareOption =>
                parseFloat( shareOption.get('options').get( this.itemViews[ shareOption.id ].templateData.input.val() ).get('price').replace(/\$|,/g, "") ) )
            .reduce( ( a, b ) => a + b ).toFixed(2) 

        this.templateData.weeklyTotal.text( this.util.format( '$%s per week', total ) )
    }

} )

module.exports = SingleShareOptions
