var View = require('../MyView'),
    ShareOption = function() { return View.apply( this, arguments ) }

Object.assign( ShareOption.prototype, View.prototype, {

    calculateShareTotal( duration ) {         
        var optionPrices = [ ],
            shareTotalClass = '.share-total-' + this.share.id,
            weeklyTotalClass = '.weekly-share-total-' + this.share.id

        this.share.get('selectedOptions').forEach( ( option, i ) => optionPrices[ i ] = parseFloat( option.price.slice(1) ) )
        
        var weeklyShareTotal = optionPrices.reduce( ( a, b ) => a + b ),
            shareTotal = duration * weeklyShareTotal

        Object.assign( this.share.attributes, { 
            weeklyShareOptionsTotal: weeklyShareTotal,
            weeklyShareOptionsTotalString: weeklyShareTotal.toFixed(2),
            shareOptionsTotal: shareTotal,
            shareOptionsTotalString: shareTotal.toFixed(2) 
        } )
        
        this.$( shareTotalClass ).text( "Share Total:  $" + shareTotal.toFixed(2) )
        this.$( weeklyTotalClass ).text( "( " + "$" + weeklyShareTotal.toFixed(2) + " per week )" )

    },
  
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
        var $input = this.templateData.input,
            selectedOptionIndex = $input.get(0).selectedIndex,
            options = this.model.attributes.options.models,
            selectedOptionLabel = $input.get(0).options[ selectedOptionIndex ].text,
            selectedOptionName = options[ selectedOptionIndex ].get('label'),
            selectedOptionPrice = options[ selectedOptionIndex ].get('price'),
            duration = this.share.get('duration'),
            priceFloat = parseFloat( selectedOptionPrice.slice(1) ),
            optionTotal = priceFloat * duration

        this.templateData.optionTotal.text( "$" + optionTotal.toFixed(2) )

        Object.assign( this.selectedOption, { 
            value: $input.val(),
            price: selectedOptionPrice,
            weeklyOptionCost: priceFloat,
            totalOptionCost: optionTotal,
            totalOptionCostString: optionTotal.toFixed(2),
            label: selectedOptionLabel,
            name: selectedOptionName
        } )
        
        this.calculateShareTotal( duration )

    }

} )

module.exports = ShareOption
