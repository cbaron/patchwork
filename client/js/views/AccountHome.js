module.exports = Object.assign( {}, require('./__proto__'), {

    Customer: require('../models/Customer'),
    Delivery: require('../models/Delivery'),
    Transactions: require('../models/CsaTransaction'),

    Views: {

        personalInfo() {
            return {
                model: Object.create( this.Model ).constructor( { }, {
                    attributes: require('../../../models/AccountInfo').attributes,
                    meta: { noPlaceholder: true },
                    resource: 'accountInfo'
                } ),
                templateOpts() {
                    return {
                        heading: 'Your Account Info',
                        submitText: 'Update'
                    }
                },
                onCancelBtnClick() { this.emit('cancel') },
                toastSuccess: 'Account updated!'
            }
        }

    },

    events: {
        accountInfoBtn: 'click',
        backBtn: 'click',
        ordersBtn: 'click',
        paymentBtn: 'click',

        views: {
            personalInfo: [
                [ 'posted', function( response ) {                    
                    Object.keys( response ).forEach( key => {
                        if( this.user.has( key ) ) this.user.set( key, response[ key ] )
                    } )

                    this.selectedCustomer.person.data.name = response.name
                    this.selectedCustomer.person.data.email = response.email
                    this.selectedCustomer.member.data.phonenumber = response.phonenumber
                    this.selectedCustomer.member.data.address = response.address
                    this.selectedCustomer.member.data.extraaddress = response.extraaddress
                    this.selectedCustomer.member.data.zipcode = response.zipcode

                    this.clearSubviews()
                } ],
                [ 'cancel', function() {
                    this.hideEl( this.els.accountInfo )
                    .then( () => this.showEl( this.els.accountNav ) )
                    .catch( this.Error )
                } ]
            ]
        }
    },

    addressSelected() {
        const place = this.addressAutoComplete.getPlace(),
            zipcode = place.address_components.find( component => component.types[0] === "postal_code" ).short_name

        this.views.personalInfo.model.set( 'zipcode', zipcode )
    },

    clearSubviews() {
        return Promise.all( [
            this.hideEl( this.els.accountInfo ),
            this.hideEl( this.els.orderInfo ),
            this.views.accountPayments.hide()
        ] )
        .then( () => {
            this.views.sharePatch.reset()
            this.views.orderOptions.els.editSummary.classList.add('fd-hidden')
            this.views.weekOptions.els.editSummary.classList.add('fd-hidden')
            this.els.backBtn.classList.add('fd-hidden')
            return this.showEl( this.els.accountNav )
        } )
        .catch( this.Error )
    },

    geolocate() {
        if( navigator.geolocation ) {
            navigator.geolocation.getCurrentPosition( position =>
              
                this.addressAutoComplete.setBounds(
                    new google.maps.Circle( {
                        center: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        },
                        radius: position.coords.accuracy } )
                    .getBounds() )

            )
        }
    },

    initAutocomplete() {
        this.addressAutoComplete = new google.maps.places.Autocomplete( this.views.personalInfo.els.address, { types: ['address'] } )

        this.addressAutoComplete.addListener( 'place_changed', this.addressSelected.bind(this) )
    },

    onAccountInfoBtnClick() {
        this.hideEl( this.els.accountNav )
        .then( () => {
            this.els.backBtn.classList.remove('fd-hidden')
            this.populateAccountFields()
            return this.showEl( this.els.accountInfo )
        } )
        .catch( this.Error )
    },

    onBackBtnClick() { this.clearSubviews() },

    onNavigation() {
        return this.show()
        .then( () => this.clearSubviews() )
        .then( () => this.views.seasons.update( this.selectedCustomer ) )
        .catch( this.Error )
    },

    onOrdersBtnClick() {
        this.hideEl( this.els.accountNav )
        .then( () => this.showEl( this.els.orderInfo ) )
        .then( () => {
            this.views.orderOptions.hideSync()
            this.views.weekOptions.hideSync()
            this.els.backBtn.classList.remove('fd-hidden')
            return this.views.seasons.update( this.selectedCustomer )
        } )
        .catch( this.Error )
    },

    onPaymentBtnClick() {
        this.hideEl( this.els.accountNav )
        .then( () => {
            this.els.backBtn.classList.remove('fd-hidden')
            this.views.accountPayments.clear()
            this.views.accountPayments.views.seasons.update( this.selectedCustomer )
            return this.views.accountPayments.show()
        } )
        .catch( this.Error )
    },

    patchMemberShare() {
        const weekPatch = this.views.weekOptions.getPatchData()

        let weekDetail = ``,
            emailTo = [ this.selectedCustomer.person.data.email ]

        if( this.selectedCustomer.person.data.secondaryEmail ) emailTo.push( this.selectedCustomer.person.data.secondaryEmail )

        if( weekPatch.addedDates.length || weekPatch.removedDates.length ) { weekDetail += ` ( ` }

        if( weekPatch.addedDates.length ) {
            const description = weekPatch.addedDates.map( date => date.slice(5) ).join(',')
            weekDetail += `Added Weeks: ${description}`
            if( weekPatch.removedDates.length ) { weekDetail += `, ` }
        }
        
        if( weekPatch.removedDates.length ) {
            const description = weekPatch.removedDates.map( date => date.slice(5) ).join(',')
            weekDetail += `Removed Weeks: ${description}`
        }
        
        if( weekPatch.addedDates.length || weekPatch.removedDates.length ) { weekDetail += ` ) ` }

        this.Xhr( {
            id: this.memberShareId,
            method: 'patch',
            resource: 'member-order',
            data: JSON.stringify( {
                adjustment: this.views.sharePatch.getPatchData(),
                memberShareId: this.memberShareId,
                name: this.selectedCustomer.person.data.name,
                orderOptions: this.views.orderOptions.getPatchData(),
                previousBalance: this.views.sharePatch.balance,
                shareLabel: this.selectedShare.label,
                weekOptions: weekPatch.allRemoved,
                weekDetail,
                to: emailTo
            } )
        } )
        .then( () => {
            this.Toast.showMessage( 'success', 'Order Updated! You will receive a confirmation email shortly.' )

            Object.keys( this.views ).forEach( key => {
                const view = this.views[ key ]
                if( view.els.editSummary && !view.isHidden( view.els.editSummary ) ) view.els.editSummary.classList.add('fd-hidden')
            } )

            this.views.seasons.els.container.scrollIntoView( { behavior: 'smooth' } )
            this.views.seasons.select( this.memberShareId )
        } )
        .catch( e => {
            console.log( e.stack || e )
            this.Toast.showMessage( 'error', 'Update Failed. Please contact us for assistance.' )
        } )
    },

    populateAccountFields() {
        this.views.personalInfo.clear()

        this.views.personalInfo.model.set( 'oldZipcode', this.selectedCustomer.member.data.zipcode || '' )

        Object.keys( this.selectedCustomer.person.data ).forEach( key => {
            if( this.views.personalInfo.els[ key ] ) this.views.personalInfo.els[ key ].value = this.selectedCustomer.person.data[ key ]
        } )

        Object.keys( this.selectedCustomer.member.data ).forEach( key => {
            if( this.views.personalInfo.els[ key ] ) this.views.personalInfo.els[ key ].value = this.selectedCustomer.member.data[ key ]
        } )
    },

    postRender() {
        this.Customer.get( { query: { email: this.user.get('email'), 'id': { operation: 'join', value: { table: 'member', column: 'personid' } } } } )
        .then( () => {
            const customer = this.Customer.data[0]
            this.selectedCustomer = customer
            
            this.views.orderOptions.hide()
            this.views.weekOptions.hide()
            this.views.sharePatch.reset();

            ( window.google && window.google.maps ) 
                ? this.initAutocomplete()
                : window.initGMap = () => this.initAutocomplete()

            this.views.seasons.on( 'selected', data => {
                this.views.sharePatch.reset()
                this.selectedShare = data.share
                this.memberShareId = this.selectedShare.membershareid

                Promise.all( [
                    this.Delivery.get( {
                        query: {
                            membershareid: data.share.membershareid,
                            deliveryoptionid: { operation: 'join', value: { table: 'deliveryoption', column: 'id' } },
                            groupdropoffid: { operation: 'leftJoin', value: { table: 'groupdropoff', column: 'id' } }
                        }
                    } ),
                    this.Transactions.get( { query: { memberShareId: data.share.membershareid } } )
                ] )
                .then( () => {
                    const balance = this.Transactions.getBalance()
                    this.views.seasons.updateBalanceNotice( balance )
                    this.views.sharePatch.balance = balance
                    Object.assign( data, { delivery: this.Delivery } )
                    this.views.orderOptions.update( data ).then( () => this.views.sharePatch.setOriginalWeeklyPrice( this.views.orderOptions.originalWeeklyPrice ) ).catch(this.Error)
                    this.views.weekOptions.update( data ).then( () => this.views.sharePatch.setWeeksAffected( this.views.weekOptions.getWeeksAffected() ) ).catch(this.Error)
                } )
            } )

            this.views.seasons.on( 'payBalance', () => {
                this.views.sharePatch.reset()

                return this.hideEl( this.els.orderInfo )
                .then( () => this.views.accountPayments.show() )
                .then( () => this.views.accountPayments.update( customer, this.selectedShare, this.memberShareId ) )
                .catch( this.Error )
            } )

            this.views.orderOptions.on( 'deliveryChanged', data => {
                this.views.sharePatch.setWeeksAffected( this.views.weekOptions.getWeeksAffected() )
                this.views.sharePatch.onWeeksReset()
                this.views.weekOptions.updateDelivery( data )
            } )

            this.views.orderOptions.on( 'reset', model => {
                this.views.weekOptions.update( model )
                this.views.sharePatch.reset()
            } )
            
            this.views.weekOptions.on( 'reset', model => this.views.sharePatch.onWeeksReset() )

            this.views.orderOptions.on( 'adjustment', data => this.views.sharePatch.onOptionsUpdate( data ) )
            this.views.weekOptions.on( 'adjustment', data => this.views.sharePatch.onWeekUpdate( data ) )

            this.views.sharePatch.on( 'patchMemberShare', () => this.patchMemberShare() )
        } )

        return this
    },

    requiresLogin: true

} )