var ListItem = require('../util/ListItem'),
    Share = function() { return ListItem.apply( this, arguments ) }

Object.assign( Share.prototype, ListItem.prototype, {

    ShareBox: require('./ShareBox'),

    postRender() {
        ListItem.prototype.postRender.call(this)

        new this.ShareBox( { container: this.templateData.shareBox, insertionMethod: 'prepend', model: this.model } )

        if( /spring/i.test( this.model.get('name') ) || /spring/i.test( this.model.get('label') ) ) {
            this.templateData.container.addClass('inactive').off('click')
        }
    },

    requiresLogin: false,

    template: require('../../templates/signup/share')( require('handlebars') )

} )

module.exports = Share
