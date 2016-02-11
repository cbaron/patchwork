module.exports = require('backbone').Model.extend( Object.assign( { }, require('../../../lib/MyObject').prototype, {

    parse( moment ) {
        return {
            id: moment.dayOfYear(),
            dayOfWeek: moment.format('ddd'),
            dayOfMonth: moment.format('D'),
            epoch: moment.unix(),
            month: moment.format('MMM'),
        }
    }

} ) )
