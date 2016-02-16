var View = require('../MyView'),
    Form = require('../util/Form').prototype,
    Summary = function() { return View.apply( this, arguments ) }

Object.assign( Summary.prototype, View.prototype, {

    Spinner: require('../../plugins/spinner.js'),

    buildRequest() {
        return JSON.stringify( {
            member: this.signupData.member,
            payment: this.getFormData(),
            shares: this.buildShares()
        } )
    },

    buildShares() {
        return this.signupData.shares.map( share => ( {
            id: share.id,
            options: share.get('selectedOptions')
                          .map( selectedOption => ( { shareoptionid: selectedOption.shareoptionid, shareoptionoptionid: selectedOption.value } ) ),
            delivery: this._( share.get('selectedDelivery') ).pick( [ 'deliveryoptionid', 'groupdropoffid' ] ),
            skipWeeks: share.get('skipWeeks').map( skipWeek => ( { date: skipWeek.date } ) )
        } ) )
    },

    cardPaymentSelected() {
        this.signupHandler = () => { if( this.validateCardInfo() ) this.signup() }

        this.templateData.paymentForm.removeClass('hide')
        this.templateData.signupBtn
            .removeClass('disabled')
            .addClass('btn-success')
            .on( 'click' , this.signupHandler )
    },

    cashPaymentSelected() {
        this.signupHandler = () => this.signup()

        this.templateData.signupBtn
            .removeClass('disabled')
            .addClass('btn-success')
            .on( 'click' , this.signupHandler )
    },

    events: {
        'paymentForm': [
            { event: 'blur', 'selector': 'input', method: 'onInputBlur' },
            { event: 'focus', 'selector': 'input', method: 'onInputFocus' }
        ]
    },

    fields: {
        number: {
            error: "Enter a card number",
            validate: function( val ) { return this.$.trim(val).length > 0 }
        },
        "exp_month": {
            error: 'Enter the month in "MM" format',
            validate: function( val ) { return val.length === 2 }
        },
        "exp_year": {
            error: 'Enter the year in "YYYY" format',
            validate: function( val ) { return val.length === 4 }
        },
        cvc: {
            error: "Enter a cvc number",
            validate: function( val ) { return this.$.trim(val).length > 0 }
        }
    },

    getTemplateOptions() {
        console.log( this.signupData.shares.map( share => share.attributes ) )
        return {
            shares: this.signupData.shares.map( share => share.attributes )
        }
    },

    onInputBlur( e ) {
        var $el = this.$( e.currentTarget ),
            field = this.fields[ $el.attr('id') ],
            result

        result = field.validate.call( this, $el.val() )

        if( result ) {
            $el.parent().parent().removeClass('has-error').addClass('has-feedback has-success')
            $el.next().removeClass('hide').removeClass('glyphicon-remove').addClass('glyphicon-ok')
            $el.siblings('.help-block').remove()
        } else { this.showError( $el, field.error ) }
    },

    onInputFocus( e ) { this.removeError( this.$( e.currentTarget ) ) },

    paymentUnselected() {
        this.templateData.signupBtn.addClass('disabled').removeClass('btn-success').off( 'click' )
        this.templateData.paymentForm.addClass('hide')
    },

    postRender() {
        View.prototype.postRender.call(this)

        this.spinner = new this.Spinner()

        this.paymentOptions
            .on( 'itemSelected', model => this[ this.util.format( '%sPaymentSelected', model.get('name') ) ]() )
            .on( 'itemUnselected', model => this.paymentUnselected() )
    },

    requiresLogin: false,

    removeError( $el ) {
        if( $el.siblings('.help-block').length === 1 ) $el.parent().parent().removeClass('has-error')
        $el.next().removeClass('hide').removeClass('glyphicon-remove')
        $el.siblings( this.util.format( '.help-block.%s', $el.attr('id') ) ).remove()
    },

    showError( $el, error ) {
        $el.parent().parent().removeClass('has-success').addClass('has-feedback has-error')
        $el.next().removeClass('hide').removeClass('glyphicon-ok').addClass('glyphicon-remove')
           .parent().append( Form.templates.fieldError( { error: error, name: $el.attr('id') } ) )
    },

    showErrorModal() {
    },
    
    showSuccessModal() {
    },

    signup() {
        this.templateData.signupBtn.off('click').text('').append( this.spinner.spin().el )

        this.$.ajax( {
            data: this.buildRequest(),
            method: "POST",
            url: "/signup" } )
        .done( () => {
            this.templateData.signupBtn.text('Thank you')
            this.showSuccessModal()
        } )
        .fail( () => {
            this.showErrorModal()
            this.templateData.signupBtn.on( 'click', this.signupHandler )
        } )
        .always( () => this.spinner.stop() )
    },

    subviews: {
        paymentOptions: [
            { name: 'paymentOptions', view: require('./PaymentOptions') },
        ],
    },

    template: require('../../templates/signup/summary')( require('handlebars') ),

    validateCardInfo() {
        var valid = true

        Object.keys( this.fields ).forEach( key => {
            var result = this.fields[ key ].validate.call( this, this.templateData[key].val() )

            if( ! result ) {
                this.showError( this.templateData[key], this.fields[ key ].error )
                valid = false
            }
        } )

        return valid
    }

} )

module.exports = Summary
