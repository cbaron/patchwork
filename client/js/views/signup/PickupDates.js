var List = require('../util/List'),
    PickupDates = function() { return List.apply( this, arguments ) }

Object.assign( PickupDates.prototype, List.prototype, {

    ItemView: require('./PickupDate'),
    ShareSkipDates: require('../../models/ShareSkipDate'),

    getItemViewOptions() { return { container: this.templateData.dates } },

    getTemplateOptions() { return this.model.attributes },

    itemModels() {
        return this.model.getDeliveryDates().models
    },

    postRender() {
        this.ShareSkipDates.get()
        .then(() => {
            this.valid = true

            this.on( 'itemSelected', model => {
                this.templateData.container.removeClass('has-error')
                this.updateShare()
            } )
            this.on( 'itemUnselected', model => this.updateShare() )
            this.on( 'itemAdded', () => {
                if( this.model.has('skipDays') &&
                    this.model.get('skipDays').length &&
                    Object.keys( this.itemViews ).length == this.items.length ) {
                    this.model.set({ skipDays:
                        this.model.get('skipDays').filter( skipDayId => {
                            if( this.items.get( skipDayId ) ) {
                                this.unselectItem( this.items.get( skipDayId ) )
                                return true 
                            }

                            return false;
                        })
                    })
                }
            })
            
            this.model.on( 'change:selectedDelivery', () => this.items.reset( this.itemModels() ) )
            List.prototype.postRender.call( this )
        })
        .catch( e => new this.Error(e) )

        return this;
    },

    requiresLogin: false,

    selected: true,

    selection: 'multiSimple',

    template: require('../../templates/signup/pickupDates'),

    updateShare() {
        this.valid = ( Object.keys( this.selectedItems ).length === 0 ) ? false : true
    }

} )

module.exports = PickupDates
