var MyView = require('./MyView'),
    Header = function() { return MyView.apply( this, arguments ) }

Object.assign( Header.prototype, MyView.prototype, {

    fields: [ 'sign up', 'about us', 'where to find us', 'member resources', 'employment', 'contact' ],

    getTemplateOptions() {
        var fields = this.fields.map( function( field ) { return field.toUpperCase() } )
        return { fields: fields }
    },

    insertionMethod: 'before',

    requiresLogin: false,

    size() {
        var content = this.$('#content'),
            jWindow = this.$(window)

        if( this.hidden ) return content.height( jWindow.height() )

        content.height( jWindow.height() - this.templateData.container.outerHeight( true ) )

        return this
    },

    template: require('../templates/header')( require('handlebars') )

} )

module.exports = new Header()
