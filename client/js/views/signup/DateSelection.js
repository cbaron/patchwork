var List = require('../util/List'),
    DateSelection = function() { return List.apply( this, arguments ) }

Object.assign( DateSelection.prototype, List.prototype, {

    ItemView: require('./PickupDates'),

    getItemViewOptions() { return { container: this.templateData.shares } },
    
    itemModels() { return this.signupData.shares.models },

    postRender() {
        List.prototype.postRender.call(this)

        this.signupData.shares.on( 'add', share => this.items.add( share ) )
                              .on( 'remove', share => this.items.remove( share ) )
    },

    requiresLogin: false,

    selection: true,

    template: require('../../templates/signup/dateSelection')( require('handlebars') ),

    validate() {
        var valid = true

        Object.keys( this.itemViews ).forEach( id => {
            if( ! this.itemViews[id].valid ) valid = false
        } )

        if( !valid ) this.templateData.container.addClass('has-error')

        return valid
    }

} )

module.exports = DateSelection
