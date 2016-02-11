var List = require('../util/List'),
    Dropoffs = function() { return List.apply( this, arguments ) }

Object.assign( Dropoffs.prototype, List.prototype, {

    ItemView: require('./Dropoff'),

    requiresLogin: false,

    selection: 'single',

    template: require('../../templates/signup/dropoffs')( require('handlebars') ),

} )

module.exports = Dropoffs
