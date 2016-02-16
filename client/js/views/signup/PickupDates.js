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
        console.log(this.model)
        return
        var deliveryDay = this.model.get('selectedDelivery').dayofweek,
            deliveryDate = this.moment( this.model.get('startdate') ),
            endDate = this.moment( this.model.get('enddate') ),
            startDay = this.moment( deliveryDate ).day(),
            dates = [ ]
        
        while( startDay != deliveryDay ) {
            deliveryDate.add( 1, 'days' )
            startDay = this.moment( deliveryDate ).day()
        }

        dates.push( new this.Models.DeliveryDate( deliveryDate, { parse: true } ) )

        while( endDate.diff( deliveryDate, 'days' ) >= 0 ) {
            dates.push( new this.Models.DeliveryDate( deliveryDate, { parse: true } ) )
            deliveryDate.add( 7, 'days' )
        }

        return dates
    },

    postRender() {
        

        this.skipWeeks = new ( this.Collection.extend( { comparator: 'epoch' } ) )()

        List.prototype.postRender.call( this )
        
        this.on( 'itemSelected', model => {
            this.skipWeeks.remove(model)
            this.updateShare()
        } )
        this.on( 'itemUnselected', model => {
            this.skipWeeks.add(model)
            this.updateShare()
        } )
        console.log(this.items)
    },

    requiresLogin: false,

    selected: true,

    selection: 'multiSimple',

    template: require('../../templates/signup/pickupDates')( require('handlebars') ),

    updateShare() {
        this.model.set( 'skipWeeks', this.skipWeeks.map( model => model.attributes ) )
    }
} )

module.exports = PickupDates
