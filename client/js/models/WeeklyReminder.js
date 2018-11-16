module.exports = { ...require('./__proto__'),

    ContactInfo: require('./ContactInfo'),
    CurrentGroups: require('./CurrentGroups'),
    DayOfWeekMap: require('./DayOfWeek'),
    DeliveryRoute: Object.create( require('./__proto__'), { resource: { value: 'deliveryroute' } } ),
    SkipWeeks: Object.create( require('./__proto__'), { resource: { value: 'membershareskipweek' } } ),

    async getSkipWeekStatus( customer ) {
        customer.isSkipping = false
        const skipWeeks = await this.SkipWeeks.get( { query: { membershareid: customer.memberShareId } } )

        const startOfWeek = this.Moment().startOf('isoWeek')
        const endOfWeek = this.Moment().endOf('isoWeek')

        skipWeeks.forEach( sw => {
            const skipDate = this.Moment( sw.date )
            if( skipDate.isBetween( startOfWeek, endOfWeek ) || skipDate.isSame( startOfWeek ) || skipDate.isSame( endOfWeek ) ) customer.isSkipping = true
        } )

    },

    getDayOptions() {
        return Object.entries( this.DayOfWeekMap ).map( ( [ k, v ] ) => `<option value="${k}">${v}</option>` ).join('')
    },

    getGroupNameOptions() {
        return this.CurrentGroups.data.map( datum => `<option value="${datum.name}">${datum.name}</option>` ).join('')
    },

    metadata: {
        columns: [
            { name: 'name', label: 'Name' },
            { name: 'email', label: 'Email' },
            { name: 'secondaryEmail', label: 'Secondary Email' },
            { name: 'deliveryLabel', label: 'Delivery Type' },
            { name: 'dayofweek', label: 'Delivery Day' }
        ]
    },

    parse( response ) {
        const contactInfo = this.ContactInfo.data
        const farmPickupInfo = this.DeliveryRoute.data[0]
        console.log( 'contactInfo' )
        console.log( contactInfo.farmpickup )
        return response.map( row => {

            if( row.deliveryName === 'farm' ) {
                row = { ...row, pickupAddress: contactInfo.farmpickup, dayofweek: farmPickupInfo.dayofweek, starttime: farmPickupInfo.starttime, endtime: farmPickupInfo.endtime }
            }

            return { ...row,
                dayofweek: this.DayOfWeekMap[ row.dayofweek ],
                starttime: row.starttime ? this.Moment( `${this.Moment().format('YYYY-MM-DD')} ${row.starttime}` ).format('h:mmA') : null,
                endtime: row.endtime ? this.Moment( `${this.Moment().format('YYYY-MM-DD')} ${row.endtime}` ).format('h:mmA') : null
            }
        } )
    },

    sortIntoEmails( list ) {
        return list.reduce( ( memo, customer ) => {
            const key = customer.dropoffName || customer.deliveryName

            if( !memo[ key ] ) {
                memo[ key ] = { }
                memo[ key ].recipients = [ ]
                memo[ key ].template = this.Templates[ customer.dropoffName ? 'group' : customer.deliveryName ]( { ...customer, hasAttachment: Boolean( this.attachment ) } )
            }

            memo[ key ].recipients.push( customer.email )
            if( customer.secondaryEmail ) memo[ key ].recipients.push( customer.secondaryEmail )

            return memo

        }, { } )
    },

    resource: 'weekly-reminder',

    Templates: {
        farm: require('../views/templates/FarmReminder'),
        group: require('../views/templates/GroupReminder'),
        home: require('../views/templates/HomeReminder')
    }

}