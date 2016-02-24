var List = require('../util/List'),
    PickupDates = function() { return List.apply( this, arguments ) }

Object.assign( PickupDates.prototype, List.prototype, {

    ItemView: require('./PickupDate'),

    Models: {
        DeliveryDate: require('../../models/DeliveryDate')
    },

    getItemViewOptions() { return { container: this.templateData.dates } },

    getTemplateOptions() { return this.model.attributes },

    itemModels() {
        var deliveryDay = this.model.get('selectedDelivery').dayofweek,
            deliveryDate = this.moment( this.model.get('startdate') ),
            endDate = this.moment( this.model.get('enddate') ),
            startDay = this.moment( deliveryDate ).day()
        
        this.dates = [ ]
        this.skipWeeks.reset([])
        this.model.set( 'datesSelected', [ ] )
        this.datesSelected.reset([])

        if( ! deliveryDay ) return 

        while( startDay != deliveryDay ) {
            deliveryDate.add( 1, 'days' )
            startDay = this.moment( deliveryDate ).day()
        }
        
        while( endDate.diff( deliveryDate, 'days' ) >= 0 ) {
            this.dates.push( new this.Models.DeliveryDate( deliveryDate, { parse: true } ) )
            deliveryDate.add( 7, 'days' )
        }

        this.model.set( 'availableShareDates', this.dates.length )

        this.dates.forEach( model => this.datesSelected.add(model) )
        this.model.set( 'datesSelected', this.datesSelected.map( model => model.attributes ) )
        
        return this.dates

    },

    postRender() {
        this.skipWeeks = new ( this.Collection.extend( { comparator: 'epoch' } ) )()
        this.datesSelected = new ( this.Collection.extend( { comparator: 'epoch' } ) )()
        this.valid = true

        this.on( 'itemSelected', model => {
            this.templateData.container.removeClass('has-error')
            this.skipWeeks.remove(model)
            this.datesSelected.add(model)
            this.updateShare()
        } )

        this.on( 'itemUnselected', model => {
            this.skipWeeks.add(model)
            this.datesSelected.remove(model)
            this.updateShare()
        } )

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
        this.valid = ( this.skipWeeks.length === this.dates.length ) ? false : true
    }

} )

module.exports = PickupDates
