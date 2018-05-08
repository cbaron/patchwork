module.exports = { ...require('./__proto__'),

    dayOfWeekMap: require('./DayOfWeek'),

    parse( response ) {
        return response.map( row => {
            const starttime = this.moment( [ this.moment().format('YYYY-MM-DD'), row.starttime ].join(' ') ).format('h:mmA')
            const endtime = this.moment( [ this.moment().format('YYYY-MM-DD'), row.endtime ].join(' ') ).format('h:mmA')
            
            return {
                ...row,
                location: row.location ? JSON.parse( row.location ).coordinates : undefined,
                hours: `${this.dayOfWeekMap[ row.dayofweek ]} ${starttime} - ${endtime}`
            }
        } )
    },

    resource: 'currentGroups'

}