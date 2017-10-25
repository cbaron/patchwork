var List = require('../util/List'),
    DateSelection = function() { return List.apply( this, arguments ) }

Object.assign( DateSelection.prototype, List.prototype, {

    ItemView: require('./PickupDates'),

    collection: { comparator: 'startEpoch' },

    getItemViewOptions() { return { container: this.templateData.shares } },
    
    itemModels() { return this.signupData.shares.models },

    postRender() {

        List.prototype.postRender.call(this)

        this.signupData.shares.on( 'add', share => this.items.add( share ) )
                              .on( 'remove', share => this.items.remove( share ) )

        this.preValidate()
    },

    preValidate() {
        this.goBack = false

        this.items.forEach( share => {
            var selectedDelivery = share.get('selectedDelivery')
            
            if( !Number.isInteger(selectedDelivery.dayofweek) || !selectedDelivery.starttime || !selectedDelivery.starttime ) {
                share.set( { selectedDelivery: { } } )
                this.goBack = true
            }
        } )
    },

    requiresLogin: false,

    selection: true,

    show() {
        List.prototype.show.call(this)

        this.preValidate()

        return this
    },

    template: require('../../templates/signup/dateSelection'),

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
            //.reject( deliveryDay => deliveryDay.get('unselectable') )

            this.items.forEach( item => item.set( 'skipDays',
                this._( item.get('deliveryDates')
                    .reject( deliveryDay => ( this.itemViews[ item.id ].selectedItems[ deliveryDay.id ] ) ? true : false ) )
                    .map( deliveryDay => deliveryDay.id )
            ) )
        }

        return valid
    }

} )

module.exports = DateSelection
