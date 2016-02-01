var Nav = require('./util/Nav'),
    Footer = function() { return Nav.apply( this, arguments ) }

Object.assign( Footer.prototype, Nav.prototype, {

    insertionMethod: 'after',

    size() {
        var body = this.$('body'),
            position = this.templateData.container.position(),
            difference = body.outerHeight( true ) - ( position.top + this.templateData.container.outerHeight( true ) )

        if( difference > 0 ) this.templateData.container.height( this.templateData.container.height( true ) + difference )

        return this
    },

    template: require('../templates/footer')( require('handlebars') )

} )

module.exports = new Footer()
