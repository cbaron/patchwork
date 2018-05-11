module.exports = require('backbone').Model.extend( Object.assign( { }, require('../../../lib/MyObject').prototype, {

    dayOfWeekMap: require('./DayOfWeek'),

    parse( response ) {
        return Object.assign( response, {
            dayOfWeek: this.dayOfWeekMap[ response.dayofweek ],
            starttime: this.moment( `${this.moment().format('YYYY-MM-DD')} ${response.starttime}` ).format('h:mmA'),
            endtime: this.moment( `${this.moment().format('YYYY-MM-DD')} ${response.endtime}` ).format('h:mmA')
        } )
    },

    urlRoot: "/deliveryroute"

} ) )
