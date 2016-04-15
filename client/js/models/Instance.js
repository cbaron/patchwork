module.exports = require('backbone').Model.extend( {

    Moment: require('moment'),

    DayOfWeekHash: {
        0: 'Sunday',
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday'
    },

    parse( response ) {

        Object.keys( response ).forEach( key => {
            
            if( response[ key ] === null ) return

            if( typeof response[key] === 'object' && response[key].type === 'date' ) {
                response[key].value = this.Moment( response[key].raw ).format('dddd, MMMM Do YYYY, h:mm:ss a') }
            
            if( typeof response[key] === 'object' && response[key].type === 'time' ) {
                response[key].value = this.Moment( [ this.Moment().format('YYYY-MM-DD'), response[ key ].raw ].join(' ') ).format('h:mmA') }

            if( key === 'dayofweek' ) { response[ key ] = { raw: response[key], value: this.DayOfWeekHash[ response[ key ] ] } }
        } )

        return response
    }
} )
