var View = require('../MyView'),
    ShareOption = function() { return View.apply( this, arguments ) }

Object.assign( ShareOption.prototype, View.prototype, {
    
    getTemplateOptions() {
        return Object.assign( { }, this.model.attributes, { options: this.model.get('options').map( model => model.attributes ) } )
    },

    requiresLogin: false,

    template: require('../../templates/signup/shareOption')( require('handlebars') )

} )

module.exports = ShareOption
