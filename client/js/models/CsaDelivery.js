module.exports = Object.assign( {}, require('./__proto__'), {

    dayOfWeekMap: require('./DayOfWeek'),

    parse( response ) {
        return response.map( row => Object.assign( row, {
            dayOfWeek: this.dayOfWeekMap[ row.dayofweek ],
            starttime: this.moment( `${this.moment().format('YYYY-MM-DD')} ${row.starttime}` ).format('h:mmA'),
            endtime: this.moment( `${this.moment().format('YYYY-MM-DD')} ${row.endtime}` ).format('h:mmA')
        } ) )
    },

    resource: "deliveryroute"

} )