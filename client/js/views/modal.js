var MyView = require('./MyView'),
    Modal = function() { return MyView.apply( this, arguments ) }

MyView.prototype._.extend( Modal.prototype, MyView.prototype, {

    emitConfirmation: function() {

        var data = { }, $ = this.$;

        this.templateData.body.find('input,select,textarea').each( function( i ) { data[ $(this).attr('id') ] = $(this).val() } )

        this.emit( 'submit', data )
    },

    events: {
        'confirmBtn': { event: 'click', selector: '', method: 'emitConfirmation' }
    },

    hide: function( options ) {

        this.templateData.container.modal('hide')

        if( options.reset ) {
            this.templateData.title.text('')
            this.templateData.header.show()
            this.templateData.body.empty()
            this.templateData.footer.show()
            this.templateData.cancelBtn.show().text('Cancel')
            this.templateData.closeBtn.show()
            this.templateData.confirmBtn.show().text('Save')
        }

        return this
    },

    postRender: function() {
        this.templateData.container.on( 'hidden.bs.modal', () => { this.hide( { reset: true } ); this.emit( 'hidden' ) } )
        this.templateData.container.on( 'shown.bs.modal', () => { this.emit( 'shown' ) } )

        return this;
    },

    requiresLogin: false,

    show( options ) {

        var bsOpts = { show: true }

        if( options.title ) {
            this.templateData.title.text( options.title )
            this.templateData.header.show()
        } else { this.templateData.header.hide() }

        if( options.body ) this.templateData.body.removeClass('hide').html( options.body )
        else this.templateData.body.addClass('hide')


        if( options.hideFooter ) this.templateData.footer.hide() 

        if( options.confirmText ) this.templateData.confirmBtn.text( options.confirmText )

        if( options.hideCancelBtn ) this.templateData.cancelBtn.hide()
        if( options.cancelText ) this.templateData.cancelBtn.text( options.cancelText )

        if( options.static ) {
            bsOpts.backdrop = 'static'
            bsOpts.keyboard = false
            this.templateData.closeBtn.hide()
        }
        
        this.templateData.container.modal( bsOpts )

        return this;
    },

    template: require('../templates/modal')( require('handlebars') ),

    updateContent: function( updates ) {
        this._.updates.each( ( value, key ) => this.templateData[ key ].html( value ) )
    }

} );

module.exports = new Modal( { container: MyView.prototype.$('body') } )
