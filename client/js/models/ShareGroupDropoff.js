module.exports = Object.assign( {}, require('./__proto__'), {

    dayOfWeekMap: require('./DayOfWeek'),

    parse( response ) {
        return response.map( row =>
            Object.assign( row, {
                dayofweek: this.dayOfWeekMap[ row.dayofweek ],
                starttime: this.moment( [ this.moment().format('YYYY-MM-DD'), row.starttime ].join(' ') ).format('h:mmA'),
                endtime: this.moment( [ this.moment().format('YYYY-MM-DD'), row.endtime ].join(' ') ).format('h:mmA')
            } )
        )
    },

    resource: 'sharegroupdropoff'

} )