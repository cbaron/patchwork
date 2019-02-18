const CustomContent = require('./util/CustomContent')

module.exports = Object.assign( {}, require('./__proto__'), CustomContent, {

    tables: [ 
        { name: 'OpenPositions', el: 'openPositions', template: 'OpenPosition' }
    ],

    templates: {
        OpenPosition: require('./templates/OpenPosition')
    }

} )
