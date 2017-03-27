module.exports = Object.assign( {}, require('../__proto__'), {

    getTemplateOptions() { return this.model.attributes },

    requiresLogin: false,

    template: require('../../templates/signup/shareBox')

} )
