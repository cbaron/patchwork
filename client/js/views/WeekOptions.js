module.exports = Object.assign( {}, require('./__proto__'), {

    Route: Object.create( require('../models/__proto__'), { resource: { value: 'deliveryroute' } } ),

    clear() {
        this.els.dates.innerHTML = ''
    },

    determineDates( dayOfWeek ) {
        this.dates = [ ]

        if( ! Number.isInteger( dayOfWeek ) ) return this

        const now = this.Moment(),
            nextWeek = ( now.day() === 6 || ( now.day() === 5 && now.hour() > 5 ) )
                ? this.Moment().day(15).hour(0).minute(0).second(0).millisecond(0)
                : this.Moment().day(8).hour(0).minute(0).second(0).millisecond(0),
            endDate = this.Moment( this.model.share.enddate )
            
        let deliveryDate = this.Moment( this.model.share.startdate ),
            startDay = deliveryDate.day()

        while( startDay != dayOfWeek ) {
            deliveryDate.add( 1, 'days' )
            startDay = this.Moment( deliveryDate ).day()
        }
        
        while( endDate.diff( deliveryDate, 'days' ) >= 0 ) {
            this.dates.push( { date: this.Moment( deliveryDate ), unselectable: Boolean( deliveryDate.diff( nextWeek ) < 0 ) } )
            deliveryDate.add( 7, 'days' )
        }

        return this
    },

    getDayOfWeek() {
        const delivery = this.model.delivery.data[0]

        return delivery.groupdropoff.id
            ? this.Xhr( { method: 'get', resource: 'sharegroupdropoff', qs: JSON.stringify( { shareid: this.model.share.id, groupdropoffid: delivery.groupdropoff.id } ) } )
              .then( response => Promise.resolve( response[0].dayofweek ) )
            : delivery.deliveryoption.name === 'farm'
                ? this.Route.data.find( route => route.label == 'farm' ).dayofweek
                : this.Xhr( {
                    method: 'get',
                    resource: 'zipcoderoute',
                    qs: JSON.stringify( {
                        zipcode: this.model.customer.member.data.zipcode,
                        routeid: { operation: 'join', value: { table: 'deliveryroute', column: 'id' } }
                    } )
                  } )
                  .then( response => Promise.resolve( response[0][ 'deliveryroute.dayofweek' ] ) )
    },

    renderDates() {
        this.dates.forEach( datum => this.slurpTemplate( { template: this.templates.date( datum ), insertion: { el: this.els.dates } } ) )
        return this
    },

    templates: {
        date: require('./templates/DeliveryDate')
    },

    update( { customer, delivery, share } ) {
        this.model = arguments[0]

        this.clear()

        this.Route.get()
        .then( () => this.getDayOfWeek() )
        .then( dayOfWeek => this.determineDates( dayOfWeek ).renderDates().show() )
        .catch( this.Error )
    }

} )
