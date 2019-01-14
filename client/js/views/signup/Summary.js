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

    DayOfWeekMap: require('../../models/DeliveryRoute').prototype.dayOfWeekMap,

    ContactInfo: require('../../models/ContactInfo'),

    Spinner: require('../../plugins/spinner.js'),

    buildRequest() {
        const addressModel = this.user.get('addressModel')

        return JSON.stringify( {
            member: Object.assign(
                this.user.pick( [ 'name', 'email', 'secondaryEmail', 'phonenumber', 'password', 'repeatpassword', 'address', 'extraaddress', 'heard', 'omission' ] ),
                { zipcode: ( addressModel && addressModel.postalCode ) ? addressModel.postalCode : '' } ),
            payment: ( this.selectedPayment === 'card' ) ? this.getFormData() : {},
            shares: this.buildShares(),
            total: ( this.fee ) ? this.grandTotalPlusFee : this.grandTotal,
            isAdmin: this.user.isAdmin(),
        } )
    },

    buildShares() {
        const templateOpts = this.getTemplateOptions()

        return this.signupData.shares.map( ( share, i ) => {
            var selectedWeeks = share.get('selectedDates').length,
                skipDays = share.get('skipDays'),
                skipDaysTotal = ( skipDays ) ? skipDays.length : 0,
                templateOptShare = templateOpts.shares[i]
            
            return {
                id: share.id,
                description:
                    this.util.format('From %s to %s you will be receiving fresh food for %d out of %d weeks.',
                        share.get('humanStartdate'), share.get('humanEnddate'), selectedWeeks, selectedWeeks + skipDaysTotal),
                label: share.get('label'),
                options: share.get('selectedOptions'),
                seasonalAddOns: share.get('seasonalAddOns'),
                delivery: this._( share.get('selectedDelivery') ).pick( [ 'deliveryoptionid', 'groupdropoffid', 'description' ] ),
                skipDays: ( skipDays ) ? skipDays.map( skipDayId => share.get('deliveryDates').get(skipDayId).get('date') ) : undefined,
                total: share.get('total'),
                selectedDelivery: templateOptShare.selectedDelivery,
                selectedOptions: templateOptShare.selectedOptions,
                formattedTotal: templateOptShare.total
            }
        } )
    },

    cardPaymentSelected() {
        this.fee = false
        this.selectedPayment = 'card'
        this.updateGrandTotal()
        this.templateData.paymentForm.removeClass('hide')
    },

    cashPaymentSelected() {
        this.fee = false
        this.selectedPayment = 'cash'
    },

    events: {
        'paymentForm': [
            { event: 'blur', 'selector': 'input', method: 'onInputBlur' },
            { event: 'focus', 'selector': 'input', method: 'onInputFocus' }
        ],
        'signupBtn': [
            { event: 'click', method: 'signup' }
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
        var spaceTwoTab = "\r\n\t\t"
        return {
            containerClass: this.containerClass,
            shares: this.signupData.shares.map( share => {
                var selectedDelivery = share.get('deliveryoptions').get( share.get('selectedDelivery').deliveryoptionid ),
                    groupDropoff = ( share.get('selectedDelivery').groupdropoffid )
                            ? share.get('groupdropoffs').get(share.get('selectedDelivery').groupdropoffid)
                            : undefined,
                    times = ( groupDropoff )
                        ? groupDropoff.pick( [ 'starttime', 'endtime' ] )
                        : this._( share.get('selectedDelivery') ).pick( [ 'starttime', 'endtime' ] ),
                    shareOptionWeeklyTotal = share.get('selectedOptions')
                        .map( selectedOption =>
                            parseFloat( share.get('shareoptions')
                                 .get( selectedOption.shareoptionid )
                                 .get( 'options' )
                                 .get( selectedOption.shareoptionoptionid )
                                 .get('price').replace(/\$|,/g, "") ) )
                        .reduce( ( a, b ) => a + b ),
                    deliveryCost = groupDropoff ? groupDropoff.get('price') : selectedDelivery.get('price'),
                    weeklyTotal =  shareOptionWeeklyTotal + parseFloat( deliveryCost.replace(/\$|,/g,"") ),
                    seasonalAddOnTotal = share.get( 'seasonalAddOns' ).map( addon =>
                       parseFloat( addon.price.replace(/\$|,/g, "") ) ).reduce( ( a, b ) => a + b, 0 ),
                    address = ( selectedDelivery.get('name') === 'home' )
                        ? this.user.get('address')
                        : ( groupDropoff )
                            ? `${groupDropoff.get('street')}, ${groupDropoff.get('cityStateZip')}`
                            : this.ContactInfo.data.farmpickup

                share.set( {
                    selectedDelivery: Object.assign( share.get('selectedDelivery'), {
                        description:
                            this.util.format('Delivery:%sMethod: %s%sDay/Time: %ss %s-%s%sPlace: %s%sCost: %s per week',
                                spaceTwoTab,
                                selectedDelivery.get('label'),
                                spaceTwoTab,
                                share.dayOfWeekMap[ share.get('selectedDelivery').dayofweek ],
                                times.starttime, times.endtime, spaceTwoTab,
                                address, spaceTwoTab, deliveryCost ) } ),
                    total: ( weeklyTotal * share.get('selectedDates').length ) + seasonalAddOnTotal
                } )

                share.set( 'selectedOptions', share.get( 'selectedOptions' ).map( selectedOption => {
                    var shareOption = share.get('shareoptions').get( selectedOption.shareoptionid ),
                        shareOptionOption = shareOption.get('options').get( selectedOption.shareoptionoptionid )

                    return Object.assign( selectedOption, {
                        description: this.util.format( '%s: %s %s -- %s per week',
                            shareOption.get('name'),
                            shareOptionOption.get('label'),
                            shareOptionOption.get('unit') || "",
                            shareOptionOption.get('price') )
                    } )
                } ) )

                return {
                    shareBox: this.templates.ShareBox( share.attributes ),
                    seasonalAddOns: share.get('seasonalAddOns'),
                    selectedOptions: share.get('selectedOptions').map( selectedOption => {
                        var shareOption = share.get('shareoptions').get( selectedOption.shareoptionid ),
                            shareOptionOption = shareOption.get('options').get( selectedOption.shareoptionoptionid )

                        return {
                            optionName: shareOption.get('name'),
                            price: shareOptionOption.get('price'),
                            selectedOptionLabel: shareOptionOption.get('label'),
                            unit: shareOptionOption.get('unit')
                        }
                    } ),
                    selectedDelivery: {
                        deliveryType: selectedDelivery.get('label'),
                        weeklyCost: deliveryCost,
                        groupdropoff: ( groupDropoff ) ? groupDropoff.get('label') : undefined,
                        address: ( groupDropoff )
                            ? groupDropoff.get('street') + ', ' + groupDropoff.get('cityStateZip')
                            : ( selectedDelivery.get('name') === 'farm' )
                                ? this.ContactInfo.data.farmpickup
                                : this.user.get('address'),
                        dayOfWeek: this.DayOfWeekMap[ share.get('selectedDelivery').dayofweek ],
                        starttime: times.starttime,
                        endtime: times.endtime
                    },
                    weeklyPrice: this.util.format( '$%s', weeklyTotal.toFixed(2) ),
                    seasonalOptionsTotal: `$${seasonalAddOnTotal.toFixed(2)}`,
                    selectedDates: share.get('selectedDates').map( date => this.templates.PickupDate( Object.assign( { selected: true }, date.attributes ) ) ),
                    weeksSelected: share.get('selectedDates').length,
                    skipDays: ( share.has('skipDays') )
                        ? share.get('skipDays').map( skipDayId => this.templates.PickupDate( share.get('deliveryDates').get(skipDayId).attributes ) ) : undefined,
                    total: this.util.format( '$%s', share.get('total').toFixed(2) )
                }
            } ) 
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
        } else {
            this.showError( $el, field.error )
        }
    },

    onInputFocus( e ) {
        var $el = this.$( e.currentTarget )
        if( $el.next().hasClass('glyphicon-remove') ) this.removeError( this.$( e.currentTarget ) )
    },

    paymentUnselected() {
        this.fee = false
        this.selectedPayment = undefined
        this.updateGrandTotal()

        this.templateData.paymentForm.addClass('hide')
        this.templateData.signupBtn.addClass('hide')
    },

    postRender() {        
        this.fee = false
        this.selectedPayment = undefined
        
        View.prototype.postRender.call(this)

        this.paymentOptions
            .on( 'itemSelected', model => {
                this.templateData.signupBtn.removeClass('hide')
                this[ this.util.format( '%sPaymentSelected', model.get('name') ) ]()
            } )
            .on( 'itemUnselected', model => this.paymentUnselected() )

        this.grandTotal = this.signupData.shares.map( share => share.get('total') ).reduce( ( a, b ) => a + b )
        this.grandTotalPlusFee = ( this.grandTotal + this.grandTotal * .03 )

        this.updateGrandTotal()
    },

    requiresLogin: false,

    removeError( $el ) {
        if( $el.siblings('.help-block').length === 1 ) $el.parent().parent().removeClass('has-error')
        $el.next().removeClass('hide').removeClass('glyphicon-remove')
        $el.siblings( this.util.format( '.help-block.%s', $el.attr('id') ) ).remove()
    },

    render() {
        var dataPromises = [ ]

        dataPromises.push( this.ContactInfo.get() )

        this.signupData.shares.forEach( share => {
            if( ! share.has('shareoptions') ) dataPromises.push( share.getShareOptions() )
            if( ! share.has('deliveryoptions') ) dataPromises.push( share.getDeliveryOptions() )
            if( ! share.has('groupdropoffs') ) dataPromises.push( share.getGroupDropoffs() )
            if( ! share.has('deliveryDates') ) dataPromises.push( share.getDeliveryDates() )
         } )

        this.Q.all( dataPromises ).then( () => {
            this.signupData.shares.forEach( share => share.getSelectedDates() )
            View.prototype.render.call(this)
        } )
        .fail( e => new this.Error(e) )
        .done()
    },

    show() {
        this.templateData.container.empty().remove()
        this.render()
        return this
    },

    showError( $el, error ) {
        var formGroup = $el.parent().parent()

        if( $el.next().hasClass( 'glyphicon-remove' ) ) return
        
        formGroup.removeClass('has-success').addClass('has-feedback has-error')
        $el.next().removeClass('hide').removeClass('glyphicon-ok').addClass('glyphicon-remove')
           .parent().append( Form.templates.fieldError( { error: error, name: $el.attr('id') } ) )
    },

    showErrorModal( opts ) {
        this.modalView.show( {
            title: 'Hmmm',
            body: ( opts && opts.error )
                ? opts.error
                : 'There was a problem.  Please contact us at eat.patchworkgardens@gmail.com.  We apologize for the inconvenience.',
            hideCancelBtn: true,
            confirmText: 'Okay' } )
        .on( 'submit', () => this.modalView.hide() )
    },
    
    showSuccessModal() {
        this.modalView.show( {
            title: 'Great Success',
            body: this.util.format( 'Thanks for signing up.  We look forward to sharing the season with you. %s',
                ( Object.keys( this.getFormData() ).length ) ?  'You should find a receipt in your email inbox.' : '' ),
            hideCancelBtn: true,
            confirmText: 'Okay' } )
        .on( 'submit', () => window.location = '/' )
        .on( 'hidden', () => window.location = '/' )
    },

    async signup() {
        if( this.isSubmitting ) return

        if( this.selectedPayment === 'card' ) {
            if( !this.validateCardInfo() ) return
        }

        this.isSubmitting = true

        this.templateData.signupBtn
            .addClass('has-spinner')
            .append( this.spinner.spin().el )

        try {
            const response = await this.Xhr( {
                data: this.buildRequest(),
                method: "post",
                resource: "signup"
            } )

            if( response.error ) {
                this.showErrorModal( { error: response.error } )  
                return
            }

            this.emit('done')
            this.paymentOptions.removeAllListeners( 'itemSelected' ).removeAllListeners( 'itemUnselected' )
            this.templateData.signupBtn.text('Thank you')
            this.user.set( 'state', { } )

            if( !this.user.isLoggedIn() ) {
                this.user.set( this.user.defaults() )
                document.cookie = `patchworkjwt=; domain=${window.location.hostname}; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`
            }
            
            this.showSuccessModal()
        } catch(err) {
            this.showErrorModal()
        } finally {
            this.spinner.stop()
            this.templateData.signupBtn.removeClass('has-spinner')
            this.isSubmitting = false
        }
    },

    subviews: {
        paymentOptions: [
            { name: 'paymentOptions', view: require('./PaymentOptions') },
        ],
    },

    template: require('../../templates/signup/summary'),

    templates: {
        PickupDate: require('../../templates/signup/pickupDate'),
        ShareBox: require('../templates/ShareBox')
    },

    updateGrandTotal() {
        var total = ( this.fee ) ? this.grandTotalPlusFee : this.grandTotal
        this.templateData.grandTotal.text( 'Grand Total :  ' + '$' + total.toFixed(2) )

        this.$('.payment-option:first-child .method-total').text( 'Grand Total :  ' + '$' + this.grandTotal.toFixed(2) )
        this.$('.payment-option:last-child .method-total').text( 'Grand Total :  ' + '$' + this.grandTotal.toFixed(2) )
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