module.exports = require('backbone').Model.extend( Object.assign( { }, require('../../../lib/MyObject').prototype, {

    dayOfWeekMap: {
        0: 'Sunday',
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday'
    },

    parse( response ) {
        response.dayOfWeek = this.dayOfWeekMap[ response.dayofweek ]
        response.starttime = this.moment( [ this.moment().format('YYYY-MM-DD'), response.starttime ].join(' ') ).format('hA')
        response.endtime = this.moment( [ this.moment().format('YYYY-MM-DD'), response.endtime ].join(' ') ).format('hA')
        console.log( response )
        return response
    },

    urlRoot: "/deliveryroute"
} ) )
