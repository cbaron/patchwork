var View = require('../MyView'),
    ShareBox = function() { return View.apply( this, arguments ) }

Object.assign( ShareBox.prototype, View.prototype, {

    getTemplateOptions() { return this.model.attributes },

    requiresLogin: false,

    template: require('../../templates/signup/shareBox')( require('handlebars') )

} )

module.exports = ShareBox
