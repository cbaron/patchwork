var List = require('../util/List'),
    ShareOptions = function() { return List.apply( this, arguments ) }

Object.assign( ShareOptions.prototype, List.prototype, {

    ItemView: require('./SingleShareOptions'),

    collection: { comparator: 'startEpoch' },

    events: {
    },

    getItemViewOptions() { return { container: this.templateData.shares, signupData: this.signupData, factory: this.factory } },

    itemModels() { return this.signupData.shares.models },

    postRender() {
        List.prototype.postRender.call(this)

        this.signupData.shares.on( 'add', share => this.items.add( share ) )
                              .on( 'remove', share => this.items.remove( share ) )
    },

    requiresLogin: false,

    selection: true,

    template: require('../../templates/signup/shareOptions'),

    validate() {
        this.signupData.shares.forEach( share => {
            share.set( 'selectedOptions', share.get( 'shareoptions' ).map( shareOption => ( {
                shareoptionid: shareOption.id,
                shareoptionoptionid: this.itemViews[ share.id ].itemViews[ shareOption.id ].templateData.input.val()
            } ) ) )

            share.set( 'seasonalAddOns', this.itemViews[ share.id ].seasonalAddOns.reduce( ( memo, addon ) => {
                const option = this.itemViews[ share.id ].SeasonalAddOnOption.data.find( option =>
                    option.id == this.itemViews[ share.id ].templateData[ addon.name ].val() && option.seasonalAddOnId === addon.id
                )

                if( !option ) return memo

                memo.push( {
                    name: addon.name,
                    label: addon.label,
                    seasonalAddOnId: addon.id,
                    seasonalAddOnOptionId: this.itemViews[ share.id ].templateData[ addon.name ].val(),
                    price: option.price,
                    unit: option.unit,
                    selectedOptionLabel: option.label
                } )

                return memo

            }, [ ] ) )

        } )

        return true
    }

} )

module.exports = ShareOptions
