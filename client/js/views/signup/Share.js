var ListItem = require('../util/ListItem'),
    Share = function() { return ListItem.apply( this, arguments ) }

Object.assign( Share.prototype, ListItem.prototype, {

    postRender() {
        ListItem.prototype.postRender.call(this)

        this.factory.create( 'shareBox', { insertion: { el: this.templateData.shareBox.get(0) }, model: this.model } )

        /*if( !this.user.isAdmin() && ( /spring/i.test( this.model.get('name') ) || /spring/i.test( this.model.get('label') ) ) ) {
            this.templateData.container.addClass('inactive').off('click')
        }*/

        return this
    },

    requiresLogin: false,

    template: require('../../templates/signup/share')

} )

module.exports = Share
