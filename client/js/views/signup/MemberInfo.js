var View = require('../MyView'),
    Form = require('../util/Form').prototype,
    MemberInfo = function() { return View.apply( this, arguments ) }

Object.assign( MemberInfo.prototype, View.prototype, {

    emailRegex: Form.emailRegex,

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
        error: "Please enter an address.",
        validate: val => this.validateAddress( val )
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
    } ],

    getTemplateOptions() { return { fields: this.fields } },

    postRender() {
        var self = this

        this.signupData.member = { }

        this.templateData.container.find('input')
        .on( 'blur', function() {
            var $el = self.$(this),
                field = self._( self.fields ).find( function( field ) { return field.name === $el.attr('id') } ),
                
            this.Q.fcall( field.validate.bind( self, $el.val() ) ).then( valid => {
                if( valid ) {
                    $el.parent().parent().removeClass('has-error').addClass('has-feedback has-success')
                    $el.next().removeClass('hide').removeClass('glyphicon-remove').addClass('glyphicon-ok')
                    $el.siblings('.help-block').remove()
                } else { self.showError( $el, field.error ) }
            }
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
        $el.parent().parent().removeClass('has-success').addClass('has-feedback has-error')
        $el.next().removeClass('hide').removeClass('glyphicon-ok').addClass('glyphicon-remove')
           .after( Form.templates.fieldError( { error: error } ) )
    },

    template: require('../../templates/signup/memberInfo')( require('handlebars') ),

    validate() {
        var valid = true
        
        if( this.templateData.container.find('has-error').length ) return false

        this.fields.forEach( field => {
            if( ! field.validate.call( this, this.templateData[ field.name ].val() ) ) {
                valid = false
                this.showError( $el, field.error )
            }
            this.signupData.member[ field.name ] = this.templateData[ field.name ].val()
        } )

        return valid
    },
    
    validateAddress( address ) {
        this.Q(
            this.$.ajax( {
                accept: "application/json",
                data: { address: address },
                method: "GET",
                url: "validate/address } ) )
        .then( response => {
            console.log( response )
        } )
        .fail( () => return false )

    }

} )

module.exports = MemberInfo
