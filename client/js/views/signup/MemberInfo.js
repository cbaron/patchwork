var View = require('../MyView'),
    Form = require('../util/Form').prototype,
    MemberInfo = function() { return View.apply( this, arguments ) }

Object.assign( MemberInfo.prototype, View.prototype, {

    addressSelected() {
        var place = this.addressAutoComplete.getPlace()

        this.templateData.address.val( place.formatted_address ) 
        this.showValid( this.templateData.address )

        this.user.set( {
            address: place.formatted_address,
            addressModel: {
                postalCode: this._( place.address_components ).find( component => component.types[0] === "postal_code" ).short_name,
                types: place.types
            }
        } )
    },

    emailRegex: Form.emailRegex,

    events: { 
        'infoBtn': { method: 'showInfoModal' }
    },

    fields: [ {
        name: 'name',
        label: 'Name',
        type: 'text',
        error: "Name is a required field.",
        validate: function( val ) { return this.$.trim(val) !== '' }
    }, {
        name: 'email',
        label: 'Email',
        type: 'text',
        error: "Please enter a valid email address.",
        validate: function( val ) { return this.emailRegex.test(val) }
    }, {
        name: 'phonenumber',
        label: 'Phone Number',
        type: 'text',
        error: "Please enter a valid phone number.",
        validate: val => val.length > 8,
    }, {
        name: 'address',
        label: 'Address',
        type: 'text',
        error: "Please enter a valid address.",
        validate: function(val) { return this.validateAddress( val ) }
    }, {
        name: 'extraaddress',
        label: 'Further Address Info ( Apt, Suite )',
        type: 'text',
        validate: () => true
    }, {
        name: 'password',
        label: 'Password',
        type: 'password',
        error: "Password must be at least six characters.",
        validate: val => val.length > 5
    }, {
        name: 'repeatpassword',
        label: 'Repeat Password',
        type: 'password',
        error: "Passwords must match.",
        validate: function( val ) { return val === this.templateData.password.val() }
    }, {
        name: 'omission',
        label: 'One vegetable to never receive',
        type: 'select',
        info: true,
        validate: () => true
    }, {
        name: 'heard',
        label: 'How you heard about us',
        type: 'text',
        validate: () => true
    } ],

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

    getTemplateOptions() { return { fields: this.fields } },

    initAutocomplete() {
        this.addressAutoComplete = new google.maps.places.Autocomplete( this.templateData.address.get(0), { types: ['address'] } )

        this.addressAutoComplete.addListener( 'place_changed', this.addressSelected.bind(this) )
    },

    initializeFoodOmission() {
        this.foods = new ( this.Collection.extend( { comparator: 'foodproduceid', url: `/food` } ) )
        
        return this.foods.fetch().then( () => {
            const data = this.foods.models.map( ( food, i ) => Object.assign( { id: i }, food.attributes ) ),
                  renderer =  data => 
                    data.produceid
                        ? `<span class="${data.producefamilyid ? 'produce-in-family' : ''}">${data.name}</span>`
                        : `<span class="produce-family">All ${data.name}</span>`

            this.templateData.omission = this.templateData.omission.magicSuggest( {
                allowFreeEntries: false,
                data,
                highlight: false,
                placeholder: '',
                maxDropHeight: 200,
                maxSelection: 1,
                renderer,
                selectionRenderer: renderer,
                valueField: 'id'
            } )

            this.templateData.omission.val = value => value ? this.templateData.omission.setSelection( value ) : this.templateData.omission.getSelection()
            return Promise.resolve()
        }, e => console.log(e.stack || e) )
    },

    postRender() {
        var self = this;

        ( window.google && window.google.maps ) 
            ? this.initAutocomplete()
            : window.initGMap = () => this.initAutocomplete()

        this.templateData.address.attr( 'placeholder', '' )
        
        this.initializeFoodOmission()
        .then( () =>
            this.fields.forEach( field => {
                if( this.user.has( field.name ) ) {
                    this.templateData[ field.name ].val( this.user.get( field.name ) )
                }
            } )
        )
        
        this.templateData.container.find('input')
        .on( 'blur', function() {
            var $el = self.$(this),
                field = self._( self.fields ).find( function( field ) { return field.name === $el.attr('id') } )
            
            if( field.name === 'address' ) {
                if( self.templateData.address.val() === '' ) self.showError( $el, field.error )
                return
            }
                  
            self.Q.fcall( field.validate.bind( self, $el.val() ) ).then( valid => {
                if( valid ) { self.showValid( $el ) }
                else { self.showError( $el, field.error ) }
            } )
        } )
        .on( 'focus', function() { self.removeError( self.$(this) ) } )

    },

    removeError( $el ) {
        $el.parent().parent().removeClass('has-error')
        $el.next().removeClass('hide').removeClass('glyphicon-remove')
        $el.siblings('.help-block').remove()
    },

    requiresLogin: false,

    showError( $el, error ) {
        var formGroup = $el.parent().parent()

        if( formGroup.hasClass( 'has-error' ) ) return

        formGroup.removeClass('has-success').addClass('has-feedback has-error')
        $el.next().removeClass('hide').removeClass('glyphicon-ok').addClass('glyphicon-remove')
           .after( Form.templates.fieldError( { error: error } ) )
    },

    showInfoModal() {
        this.Xhr( { method: 'get', resource: 'csacustomization' } )
        .then( data =>
            this.modalView.show( {
                body: this.templates.csaCustomization( data[0] ),
                hideFooter: true
            } )
        )
        .catch( e => new this.Error(e) )
    },

    showValid( $el ) {
        $el.parent().parent().removeClass('has-error').addClass('has-feedback has-success')
        $el.next().removeClass('hide').removeClass('glyphicon-remove').addClass('glyphicon-ok')
        $el.siblings('.help-block').remove()
    },

    template: require('../../templates/signup/memberInfo'),

    templates: {
        csaCustomization: require('../../templates/csaCustomization')
    },

    validate() {
        var valid = true
        
        if( this.templateData.container.find('has-error').length ) return false

        return this.Q.all( this.fields.map( field => {
            return this.Q.when( field.validate.call(this, this.templateData[ field.name ].val() ) )
            .then( result => {
                if( result === false ) {
                    valid = false
                    this.showError( this.templateData[ field.name ], field.error )
                } else {
                    this.user.set( field.name, this.templateData[ field.name ].val() )
                }
            } )
        } ) )
        .then( () => {
            if( valid ) {
                return this.Q( this.$.ajax( {
                    data: JSON.stringify( this.user.attributes ),
                    method: "PATCH",
                    url: "/user" } ) )
            }
        } )
        .then( () => valid )
        .fail( e => { console.log( e.stack || e ); return false } )
    },
    
    validateAddress( address ) {
        var addressModel, customAddress

        if( this.$.trim( address ).length === 0 ) return false

        addressModel = this.user.get('addressModel')
        customAddress = ( address !== this.user.get('address') || !addressModel || ( ! this._( addressModel.types ).contains( "street_address" ) ) ) ? true : false
        
        this.user.set( { customAddress: customAddress } )

        if( customAddress ) this.user.set( { addressModel: { } } )
                
        return true
    },

} )

module.exports = MemberInfo
