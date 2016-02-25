var List = require('../util/List'),
    PickupDates = function() { return List.apply( this, arguments ) }

Object.assign( PickupDates.prototype, List.prototype, {

    ItemView: require('./PickupDate'),

    getItemViewOptions() { return { container: this.templateData.dates } },

    getTemplateOptions() { return this.model.attributes },

    itemModels() {
        return this.model.getDeliveryDates().models
    },

    postRender() {
        this.skipWeeks = new ( this.Collection.extend( { comparator: 'epoch' } ) )()
        this.datesSelected = new ( this.Collection.extend( { comparator: 'epoch' } ) )()
        this.valid = true

        this.on( 'itemSelected', model => {
            this.templateData.container.removeClass('has-error')
            this.updateShare()
        } )

        this.on( 'itemUnselected', model => this.updateShare() )

        this.on( 'itemAdded', () => {
            if( this.model.has('skipWeeks') &&
                this.model.get('skipWeeks').length &&
                Object.keys( this.itemViews ).length == this.items.length ) {

                this.model.get('skipWeeks').forEach( skipWeek => {
                    if( this.items.get( skipWeek.id ) ) this.unselectItem( this.items.get( skipWeek.id ) )
                } )
            }
        } )
        
        List.prototype.postRender.call( this )

        this.model.on( 'change:selectedDelivery', () => this.items.reset( this.itemModels() ) )
    },

    requiresLogin: false,

    selected: true,

    selection: 'multiSimple',

    template: require('../../templates/signup/pickupDates')( require('handlebars') ),

    updateShare() {
        this.valid = ( Object.keys( this.selectedItems ).length === 0 ) ? false : true
    }

} )

module.exports = PickupDates
