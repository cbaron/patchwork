var View = require('../MyView'),
    ShareOption = function() { return View.apply( this, arguments ) }

Object.assign( ShareOption.prototype, View.prototype, {
    
    getTemplateOptions() {
        return Object.assign( { }, this.model.attributes, { options: this.model.get('options').map( model => model.attributes ) } )
    },

    postRender() {

        this.selectedOption = { shareoptionid: this.model.id, shareoptionlabel: this.model.get('label') }

        this.share.set( 'selectedOptions',
            ( this.share.has('selectedOptions') ) ? this.share.get('selectedOptions').concat( this.selectedOption ) : [ this.selectedOption ] )

        this.templateData.input.on( 'change', () => this.updateShare() )

        this.updateShare()
    },

    requiresLogin: false,

    template: require('../../templates/signup/shareOption')( require('handlebars') ),

    updateShare() {
        var $input = this.templateData.input

        Object.assign( this.selectedOption, { value: $input.val(), label: $input.get(0).options[$input.get(0).selectedIndex].text } )
    },

} )

module.exports = ShareOption
