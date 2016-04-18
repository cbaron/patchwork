module.exports = require('backbone').Model.extend( Object.assign( { }, require('../../../lib/MyObject').prototype, {
 
    dayOfWeekMap: require('./DeliveryRoute').prototype.dayOfWeekMap,

    initialize() {
        this.on( 'change:dayofweek', () => this.updateReadableDay() )
    },

    updateReadableDay() {
        this.set( { dayOfWeek: this.dayOfWeekMap[ this.get('dayofweek') ] } )
    }

} ) )
