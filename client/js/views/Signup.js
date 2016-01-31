var MyView = require('./MyView'),
    Signup = function() { return MyView.apply( this, arguments ) }

Object.assign( Signup.prototype, MyView.prototype, require('./util/Form').prototype, {

    //checkForEnter( e ) { if( e.keyCode === 13 ) this.submitForm() },

    events: {
        'alreadyMember': { event: 'click', selector: '', method: 'showModalLogin' },
    },

    fields: [
        { name: 'name', label: 'Name', type: 'text', error: "Name is a required field.", validate: function( val ) { return this.$.trim(val) !== '' } },
        { name: 'email', label: 'Email', type: 'text', error: "Please enter a valid email address.", validate: function( val ) { return this.emailRegex.test(val) } },
        { name: 'phonenumber', label: 'Phone Number', type: 'text', validate: function() { } },
        { name: 'address', label: 'Address', type: 'text', validate: function() { } },        
    ],

    getTemplateOptions() { return { fields: this.fields, loginFields: this.loginFields } },

    loginFields: [
        { name: "email", label: 'Email', type: 'text', error: "Please enter a valid email address.", validate: function( val ) { return this.emailRegex.test(val) } },
        { name: "password", label: 'Password', type: 'password', error: "Passwords must be at least 6 characters long.", validate: function( val ) { return this.validatePassword(val) } }
    ],

    modalFormFail: function( error ) {
        console.log( error.stack || error );
        this.slurpTemplate( { template: this.templates.serverError( error ), insertion: { $el: this.modalView.templateData.body } } )
    },

    modalLogin: require('../templates/modalLogin')( require('handlebars') ),

    modalSubmissionResponse( response ) {
        
        if( Object.keys( response ).length === 0 ) {            
            return this.slurpTemplate( { template: this.templates.invalidLoginError( response ), insertion: { $el: this.modalView.templateData.body } } )
        }
    
        require('../models/User').set( response );
        this.emit( "success" );
        
        this.modalView.hide( { reset: true } )
        this.templateData.memberInfo.hide()
        this.templateData.alreadyMemberHeader.show()
    },

    postRender() {
        this.templateData.container.find( 'input' ).on( 'blur', this.validateForm.bind(this) )
                                                   .on( 'focus', this.removeErrors.bind(this) )
        //this.$(document).on( 'keyup', this.checkForEnter.bind(this) )
    },

    requiresLogin: false,

    showModalLogin() {
        this.modalView.show( {
            title: "Login",
            body: this.modalLogin( this.getTemplateOptions() ),
            cancelText: "Cancel",
            confirmText: "Log In"
        } ).on( 'submit', ( data ) => this.submitModalForm( data ) )
        
        this.$(':focus').blur()

        this.$('.modal-body').on( 'focus', '#email, #password', this.removeErrors.bind(this) )
        
    },

    submitModalForm( data ) {
        if( this.validateModalForm( data ) === false ) return
        this.postForm( { resource: 'auth', values: data } )
        .then( this.modalSubmissionResponse.bind(this) )
        .fail( this.modalFormFail.bind(this) )
        .done() 
    },

    template: require('../templates/signup')( require('handlebars') ),

    validateModalForm( data ) {
        
        var valid = true
        
        if ( this.templateData.invalidLoginError ) this.templateData.invalidLoginError.remove();
        if ( this.templateData.serverError ) this.templateData.serverError.remove();

        this.loginFields.forEach( field => {

            this.modalView.templateData[ field.name ].parent().removeClass('has-error');
            this.modalView.templateData[ field.name ].next().remove();

            if ( field.validate.call( this, data[ field.name ] ) === false ) {
                valid = false

                this.modalView.templateData[ field.name ].parent().addClass('has-error');
                this.slurpTemplate( { template: this.templates.fieldError( field ), insertion: { $el: this.modalView.templateData[ field.name ].parent(), method: 'append' } } )
          }

        }, this )
        
        return valid
    }

} )

module.exports = Signup