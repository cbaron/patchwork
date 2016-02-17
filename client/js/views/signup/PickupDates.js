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

        while( startDay != deliveryDay ) {
            deliveryDate.add( 1, 'days' )
            startDay = this.moment( deliveryDate ).day()
        }

        this.dates.push( new this.Models.DeliveryDate( deliveryDate, { parse: true } ) )

        while( endDate.diff( deliveryDate, 'days' ) >= 0 ) {
            this.dates.push( new this.Models.DeliveryDate( deliveryDate, { parse: true } ) )
            deliveryDate.add( 7, 'days' )
        }

        return this.dates

    },

    postRender() {
        this.dates = [ ]
        this.skipWeeks = new ( this.Collection.extend( { comparator: 'epoch' } ) )()
        this.valid = true

        List.prototype.postRender.call( this )
        
        this.on( 'itemSelected', model => {
            this.skipWeeks.remove(model)
            this.updateShare()
        } )
        this.on( 'itemUnselected', model => {
            this.skipWeeks.add(model)
            this.updateShare()
        } )
        console.log('items: ' + this.items)
    },

    requiresLogin: false,

    selected: true,

    selection: 'multiSimple',

    template: require('../../templates/signup/pickupDates')( require('handlebars') ),

    updateShare() {
        this.model.set( 'skipWeeks', this.skipWeeks.map( model => model.attributes ) )

        this.valid = ( this.skipWeeks.length === this.dates.length ) ? false : true
    }
} )

module.exports = PickupDates
