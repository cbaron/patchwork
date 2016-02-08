var ListItem = require('../util/ListItem'),
    Share = function() { return ListItem.apply( this, arguments ) }

Object.assign( Share.prototype, ListItem.prototype, {

    requiresLogin: false,

    template: require('../../templates/signup/share')( require('handlebars') )

} )

module.exports = Share
