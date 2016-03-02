var MyView = require('./MyView'),
    Modal = function() { return MyView.apply( this, arguments ) }

MyView.prototype._.extend( Modal.prototype, MyView.prototype, {

    checkForEnter( e ) { if( e.keyCode === 13 ) this.emitConfirmation() },

    emitConfirmation: function() {
        var data = this.getFormData()
        this.emit( 'submit', data )
    },

    events: {
        'confirmBtn': { event: 'click', selector: '', method: 'emitConfirmation' }
    },

    hide: function( options ) {
        this.templateData = this._.omit( this.templateData, [ "email", "password" ] )

        this.templateData.container.modal('hide')

        this.templateData.title.text('')
        this.templateData.header.show()
        this.templateData.body.removeClass('hide').empty()
        this.templateData.footer.show()
        this.templateData.cancelBtn.show().text('Cancel')
        this.templateData.closeBtn.show()
        this.templateData.confirmBtn.show().text('Save')

        return this
    },

    postRender: function() {
        this.$(document).on( 'keyup', this.checkForEnter.bind(this) )

        this.templateData.container.on( 'hidden.bs.modal', () => {
            this.hide( { reset: true } )
            this.emit( 'hidden' )
            this.removeAllListeners( 'submit' )
        } )

        this.templateData.container.on( 'shown.bs.modal', () => { 
            this.emit( 'shown' )
            this.$('.modal-body input:first').focus()
        } )

        return this;
    },

    requiresLogin: false,

    show( options ) {

        var bsOpts = { show: true }

        if( options.title ) {
            this.templateData.title.text( options.title )
            this.templateData.header.show()
        } else { this.templateData.header.hide() }

        if( options.body ) {
            this.templateData.body.removeClass('hide')
            this.slurpTemplate( { template: options.body, insertion: { $el: this.templateData.body, method: 'append' } } )
        } else if( !options.body && this.templateData.body.children().length === 0 ) { this.templateData.body.addClass('hide') }

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
