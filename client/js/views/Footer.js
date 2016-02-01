var Nav = require('./util/Nav'),
    Footer = function() { return Nav.apply( this, arguments ) }

Object.assign( Footer.prototype, Nav.prototype, {

    insertionMethod: 'after',

    size() {
        var body = this.$('body'),
            position = this.templateData.container.position(),
            difference

        if( this.templateData.container.prop('style').height ) this.templateData.container.attr('style','')

        difference = body.outerHeight( true ) - ( position.top + this.templateData.container.outerHeight( true ) )

        if( difference > 0 ) this.templateData.container.height( this.templateData.container.height() + difference )

        return this
    },

    template: require('../templates/footer')( require('handlebars') )

} )

module.exports = new Footer()
