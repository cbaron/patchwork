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
        var valid = true,
            errorViews = [ ],
            targetErrorView = null

        Object.keys( this.itemViews ).forEach( id => {
            if( ! this.itemViews[id].valid ) {
                valid = false
                errorViews.push( this.itemViews[id].templateData.container )
                this.itemViews[id].templateData.container.addClass('has-error')
            }
        } )
        
        if( errorViews.length ) {
            targetErrorView = errorViews.slice(-1)[0]
            this.$('html, body').animate( {
                scrollTop: targetErrorView.offset().top
            }, 500 )
        }

        if( valid ) {
            this.items.forEach( item => item.set( 'skipDays',
                item.get('deliveryDays').filter( deliveryDay => ( this.itemViews[ item.id ].selectedItems[ deliveryDay.id ] ) ? true : false )
                                        .map( deliveryDay => deliveryDay.id )
            ) )
        }

        return valid
    }

} )

module.exports = DateSelection
