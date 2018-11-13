module.exports = { ...require('./__proto__'),

    CurrentGroups: require('../models/CurrentGroups'),
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
        return this.metadata.options.days.map( opt => `<option value="${opt.value}">${opt.label}</option>` ).join('')
    },

    getGroupNameOptions() {
        return this.CurrentGroups.data.map( datum => `<option value="${datum.name}">${datum.name}</option>` ).join('')
    },

    /*getLocationOptions() {
        const locations = [ ]

        return this.CurrentGroups.data.reduce( ( memo, datum ) => {
            if( locations.includes( datum.street ) ) return memo
            return memo += `<option value="${datum.street}">${datum.street}, ${datum.cityStateZip}</option>`
        }, `` )
    },*/

    metadata: {
        columns: [
            { name: 'name', label: 'Name' },
            { name: 'email', label: 'Email' },
            { name: 'secondaryEmail', label: 'Secondary Email' },
            { name: 'delivery', label: 'Delivery Type' },
            { name: 'dayofweek', label: 'Delivery Day' }
        ],
        options: {
            days: [
                { value: '1', label: 'Monday' },
                { value: '2', label: 'Tuesday' },
                { value: '3', label: 'Wednesday' },
                { value: '4', label: 'Thursday' },
                { value: '5', label: 'Friday' },
                { value: '6', label: 'Saturday' },
                { value: '7', label: 'Sunday' }
            ]
        }
    },

    parse( response ) {
        const farmPickupInfo = this.DeliveryRoute.data[0]

        return response.map( row => {
            if( row.delivery === 'On-farm Pickup') {
                row = { ...row, dayofweek: farmPickupInfo.dayofweek, starttime: farmPickupInfo.starttime, endtime: farmPickupInfo.endtime }
            }

            if( row.dayofweek ) row.dayofweek = this.metadata.options.days.find( opt => opt.value == row.dayofweek ).label

            return row
        } )
    },

    resource: 'weekly-reminder'

}