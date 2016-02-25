var List = require('../util/List'),
    SingleShareOptions = function() { return List.apply( this, arguments ) }

Object.assign( SingleShareOptions.prototype, List.prototype, {

    ItemView: require('./ShareOption'),

    Views: {
        ShareBox: require('./ShareBox')
    },

    getItemViewOptions() {
        return {
            container: this.templateData.options,
            share: this.model
        }
    },

    getTemplateOptions() { return this.model.attributes },

    postRender() {
        
        var share = this.model
        
        List.prototype.postRender.call( this )

        this.on( 'itemAdded', shareOption => {
            this.itemViews[ shareOption.id ].on( 'changed', () => this.updateTotal() )
            if( share.get('selectedOptions') ) {
                share.get('selectedOptions').forEach( selectedOption => {
                    if( selectedOption.shareoptionid == shareOption.id ) {
                        this.itemViews[ shareOption.id ].templateData.input.val( selectedOption.shareoptionoptionid )
                    }
                } )
            }
            if( Object.keys( this.itemViews ).length == this.items.length ) this.updateTotal()
        } )

        new this.Views.ShareBox( { container: this.templateData.shareBox, insertionMethod: 'prepend', model: share } )

        this.model.getShareOptions()
            .then( () => this.get('shareoptions').forEach( shareoption => items.add( shareoption ) ) )
            .fail( e => console.log( e.stack || e ) )
    },

    requiresLogin: false,

    template: require('../../templates/signup/singleShareOptions')( require('handlebars') ),

    updateTotal() {
        var total =
            this.items.map( shareOption =>
                parseFloat( shareOption.get('options').get( this.itemViews[ shareOption.id ].templateData.input.val() ).get('price').replace(/\$|,/g, "") ) )
            .reduce( ( a, b ) => a + b ).toFixed(2) 

        this.templateData.total.text( this.util.format( '$%s per week', total ) )
    }

} )

module.exports = SingleShareOptions
