var ListItem = require('../util/ListItem'),
    Share = function() { return ListItem.apply( this, arguments ) }

Object.assign( Share.prototype, ListItem.prototype, {

    postRender() {
        ListItem.prototype.postRender.call(this)

        this.factory.create( 'shareBox', { insertion: { value: { el: this.templateData.shareBox.get(0) } }, model: { value: this.model } } )

        if( /spring/i.test( this.model.get('name') ) || /spring/i.test( this.model.get('label') ) ) {
            this.templateData.container.addClass('inactive').off('click')
        }

        return this
    },

    requiresLogin: false,

    template: require('../../templates/signup/share')( require('handlebars') )

} )

module.exports = Share
