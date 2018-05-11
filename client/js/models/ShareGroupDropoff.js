module.exports = Object.assign( {}, require('./__proto__'), {

    dayOfWeekMap: require('./DayOfWeek'),

    parse( response ) {
        return response.map( row =>
            Object.assign( row, {
                dayofweek: this.dayOfWeekMap[ row[ 'sharegroupdropoff.dayofweek' ] || row.dayofweek ],
                starttime: this.moment( `${this.moment().format('YYYY-MM-DD')} ${row[ 'sharegroupdropoff.starttime' ] || row.starttime}` ).format('h:mmA'),
                endtime: this.moment( `${this.moment().format('YYYY-MM-DD')} ${row[ 'sharegroupdropoff.endtime' ] || row.endtime}` ).format('h:mmA'),
                location: row.location ? JSON.parse( row.location ).coordinates : undefined
            } )
        )
    },

    resource: 'sharegroupdropoff'

} )