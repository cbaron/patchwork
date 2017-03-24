var View = require('../MyView'),
    ShareBox = function() { return View.apply( this, arguments ) }

Object.assign( ShareBox.prototype, View.prototype, {

//module.exports = Object.assign( {}, require('../__proto__'), {

    getTemplateOptions() { return this.model.attributes },

    requiresLogin: false,

    template: require('../../templates/signup/shareBox')

} )

module.exports = ShareBox
