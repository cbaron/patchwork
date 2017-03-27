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

    template: require('../../templates/signup/shareOptions')( require('handlebars') ),

    validate() {

        this.signupData.shares.forEach( share => {
            share.set( 'selectedOptions', share.get( 'shareoptions' ).map( shareOption => ( {
                shareoptionid: shareOption.id,
                shareoptionoptionid: this.itemViews[ share.id ].itemViews[ shareOption.id ].templateData.input.val()
            } ) ) )
        } )

        return true
    }

} )

module.exports = ShareOptions
