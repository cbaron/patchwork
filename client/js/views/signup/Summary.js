var View = require('../MyView'),
    Form = require('../util/Form').prototype,
    Summary = function() { 
        
        window.spinner = this.spinner = new this.Spinner( {
            color: '#fff',
            lines: 7,
            length: 2,
            radius: 14,
            scale: 0.5
        } ) 

        return View.apply( this, arguments )
    }

Object.assign( Summary.prototype, View.prototype, {

    Spinner: require('../../plugins/spinner.js'),

    buildRequest() {
        return JSON.stringify( {
            member: this.signupData.member,
            payment: this.getFormData(),
            shares: this.buildShares(),
            total: ( this.fee ) ? this.grandTotalPlusFee : this.grandTotal
        } )
    },

    buildShares() {
        return this.signupData.shares.map( share => ( {
            id: share.id,
            label: share.label,
            options: share.get('selectedOptions')
                          .map( selectedOption => ( { shareoptionid: selectedOption.shareoptionid, shareoptionoptionid: selectedOption.value } ) ),
            delivery: this._( share.get('selectedDelivery') ).pick( [ 'deliveryoptionid', 'groupdropoffid' ] ),
            skipWeeks: share.get('skipWeeks').map( skipWeek => ( { date: skipWeek.date } ) )
        } ) )
    },

    calculateTotals() {
        var shareTotals = [ ]

        this.signupData.shares.forEach( share  => {
            var skipWeeks = share.get('skipWeeks').length,
                shareDuration = share.get('availableShareDates'),
                weeklyShareOptionsTotal = share.get('weeklyShareOptionsTotal'),
                weeklyDeliveryTotal = share.get('selectedDelivery')[ 'weeklyCost' ],
                priceReduction = skipWeeks * ( weeklyShareOptionsTotal + weeklyDeliveryTotal ),
                shareTotal = ( share.get('shareOptionsTotal') + share.get('selectedDelivery')[ 'totalCost' ] ) - priceReduction

            if( weeklyDeliveryTotal < 0 ) priceReduction = skipWeeks * weeklyShareOptionsTotal

            shareTotals.push( shareTotal )

            this.templateData[ this.util.format( 'priceReduction-%s', share.id ) ].text( 'Price Reduction :  ' + '$' + priceReduction.toFixed(2) )
            this.templateData[ this.util.format( 'shareTotal-%s', share.id ) ].text( 'Share Total :  ' + '$' + shareTotal.toFixed(2) )
        } )

        this.grandTotal = shareTotals.reduce( ( a, b ) => a + b )
        this.grandTotalPlusFee = this.grandTotal + this.grandTotal * .03

        this.updateGrandTotal()

    },

    cardPaymentSelected() {
        this.signupHandler = () => { if( this.validateCardInfo() ) this.signup() }

        this.fee = true
        this.updateGrandTotal()

        this.templateData.paymentForm.removeClass('hide')
        this.templateData.signupBtn
            .removeClass('disabled')
            .addClass('btn-success')
            .on( 'click' , this.signupHandler )
    },

    cashPaymentSelected() {
        this.signupHandler = () => this.signup()

        this.fee = false

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
        return {
            shares: this.signupData.shares.map( share => share.attributes ),
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

        this.fee = false
        this.updateGrandTotal()

        this.templateData.signupBtn.addClass('disabled').removeClass('btn-success').off( 'click' )
        this.templateData.paymentForm.addClass('hide')
    },

    postRender() {
        
        this.fee = false
        
        View.prototype.postRender.call(this)

        this.paymentOptions
            .on( 'itemSelected', model => this[ this.util.format( '%sPaymentSelected', model.get('name') ) ]() )
            .on( 'itemUnselected', model => this.paymentUnselected() )

        this.calculateTotals()
        this.updateSummaryInfo()
    },

    requiresLogin: false,

    removeError( $el ) {
        if( $el.siblings('.help-block').length === 1 ) $el.parent().parent().removeClass('has-error')
        $el.next().removeClass('hide').removeClass('glyphicon-remove')
        $el.siblings( this.util.format( '.help-block.%s', $el.attr('id') ) ).remove()
    },

    show() {
        this.templateData.container.empty().remove()
        this.render()
        return this
    },

    showError( $el, error ) {
        $el.parent().parent().removeClass('has-success').addClass('has-feedback has-error')
        $el.next().removeClass('hide').removeClass('glyphicon-ok').addClass('glyphicon-remove')
           .parent().append( Form.templates.fieldError( { error: error, name: $el.attr('id') } ) )
    },

    showErrorModal() {
        this.modalView.show( {
            title: 'Hmmm',
            body: 'There was a problem.  Please contact us at eat.patchworkgardens@gmail.com.  We apologize for the inconvenience',
            hideCancelBtn: true,
            confirmText: 'Okay' } ).on( 'submit', () => this.modalView.hide() )
    },
    
    showSuccessModal() {
        this.modalView.show( {
            title: 'Great Success',
            body: this.util.format( 'Thanks for signing up.  We look forward to sharing the season with you. %s',
                ( Object.keys( this.getFormData() ).length ) ?  'You should find a receipt in your email inbox' : '' ),
            hideCancelBtn: true,
            confirmText: 'Okay' } ).on( 'submit', () => this.modalView.hide() )
    },

    signup() {
        this.templateData.signupBtn
            .off('click')
            .addClass('has-spinner')
            .append( this.spinner.spin().el )

        this.$.ajax( {
            data: this.buildRequest(),
            headers: { 'Content-Type': 'application/json' },
            method: "POST",
            url: "/signup" } )
        .done( () => {
            this.emit('done')
            this.paymentOptions.removeAllListeners( 'itemSelected' ).removeAllListeners( 'itemUnselected' )
            //this.templateData.signupBtn.text('Thank you')
            this.showSuccessModal()
        } )
        .fail( () => {
            this.showErrorModal()
            this.templateData.signupBtn
                .on( 'click', this.signupHandler )
                .text('Become a Member!')
        } )
        .always( () => {
            //this.spinner.stop()
            //this.templateData.signupBtn.removeClass('has-spinner')
       } )
    },

    subviews: {
        paymentOptions: [
            { name: 'paymentOptions', view: require('./PaymentOptions') },
        ],
    },

    template: require('../../templates/signup/summary')( require('handlebars') ),

    updateGrandTotal() {
        var total = ( this.fee ) ? this.grandTotalPlusFee : this.grandTotal
        this.templateData.grandTotal.text( 'Grand Total :  ' + '$' + total.toFixed(2) )

        this.$('.payment-option:first-child .method-total').text( 'Grand Total :  ' + this.grandTotal.toFixed(2) )
        this.$('.payment-option:last-child .method-total').text( 'Grand Total :  ' + this.grandTotalPlusFee.toFixed(2) )
    },

    updateSummaryInfo() {
        this.signupData.shares.forEach( share => {
            this.templateData[ this.util.format( 'skipWeeks-%s', share.id ) ][ ( share.get('skipWeeks').length ) ? 'show' : 'hide' ]()

            if( share.get('selectedDelivery')[ 'deliveryType' ] === "Home Delivery" ) {
                this.templateData[ this.util.format( 'deliveryAddress-%s', share.id ) ].append( this.signupData.member.address )
            } else if( share.get('selectedDelivery')[ 'deliveryType' ] === "On-farm Pickup" ) {
                this.templateData[ this.util.format( 'deliveryAddress-%s', share.id ) ].text( "9057 W. Third St., Dayton, OH 45417" )
                this.templateData[ this.util.format( 'deliveryTotal-%s', share.id ) ].text(
                    this.util.format( 'Save $%s at $1.00 / week', share.get('availableShareDates').toFixed(2) ) )
            }
        } )
    },

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
