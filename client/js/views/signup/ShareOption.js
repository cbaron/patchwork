var View = require('../MyView'),
    ShareOption = function() { return View.apply( this, arguments ) }

Object.assign( ShareOption.prototype, View.prototype, {

    events: {
        'optionIcon': { method: 'showOptionInfo' }
    },
  
    getTemplateOptions() {
        return Object.assign( { }, this.model.attributes, { options: this.model.get('options').map( model => model.attributes ) } )
    },

    postRender() {
        this.updateTotal()

        this.templateData.input.on( 'change', () => {
            this.updateTotal()
            this.emit( 'changed', this.templateData.input.val() )
        } )
    },

    requiresLogin: false,

    showOptionInfo() {
        this.modalView.show( {
            title: this.model.get('name'),
            body: this.model.get('description'),
            hideFooter: true
        } )
    },

    template: require('../../templates/signup/shareOption')( require('handlebars') ),

    updateTotal() {
        this.templateData.total.text(
            this.util.format( '$%s per week',
                parseFloat( this.model.get('options').at( this.templateData.input.get(0).selectedIndex ).get('price').replace(/\$|,/g, "") ).toFixed(2) ) )
    }

} )

module.exports = ShareOption
