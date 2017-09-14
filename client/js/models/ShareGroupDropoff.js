module.exports = Object.assign( {}, require('./__proto__'), {

    dayOfWeekMap: require('./DayOfWeek'),

    parse( response ) {
        return response.map( datum =>
            Object.assign( datum, {
                dayofweek: this.dayOfWeekMap[ datum.dayofweek ],
                starttime: this.moment( [ this.moment().format('YYYY-MM-DD'), datum.starttime ].join(' ') ).format('h:mmA'),
                endtime: this.moment( [ this.moment().format('YYYY-MM-DD'), datum.endtime ].join(' ') ).format('h:mmA')
            } )
        )
    },

    resource: 'sharegroupdropoff'

} )