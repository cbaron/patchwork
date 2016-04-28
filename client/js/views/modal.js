var MyView = require('./MyView'),
    Modal = function() { return MyView.apply( this, arguments ) }

MyView.prototype._.extend( Modal.prototype, MyView.prototype, {

    checkForEnter( e ) { if( e.keyCode === 13 ) this.emitConfirmation() },

    emitConfirmation: function() {
        this.emit( 'submit', this.getFormData() )
    },

    events: {
        'confirmBtn': { event: 'click', selector: '', method: 'emitConfirmation' }
    },

    hide: function( options ) {
        
        this.templateData = this._.pick( this.templateData, this.templateDataKeys )

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
            var firstInput = this.$('.modal-body input:first')
            this.emit( 'shown' )
            if( firstInput.length && (! /date/.test( firstInput.attr('id') ) ) ) firstInput.focus()
        } )

        return this;
    },

    requiresLogin: false,

    show( options ) {

        this.templateDataKeys = Object.keys( this.templateData )

        var bsOpts = { show: true }

        if( options.title ) {
            this.templateData.title.text( options.title )
            this.templateData.header.show()
        } else { this.templateData.header.hide() }

        if( options.body ) {
            this.templateData.body.removeClass('hide')
            options.body.charAt(0) === '<'
                ? this.slurpTemplate( { template: options.body, insertion: { $el: this.templateData.body, method: 'append' } } )
                : this.templateData.body.html( options.body )
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
