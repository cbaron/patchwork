var MyView = require('./MyView'),
    Signup = function() { return MyView.apply( this, arguments ) }

Object.assign( Signup.prototype, MyView.prototype, {

    events: {
        'alreadyMember': { event: 'click', selector: '', method: 'showModalLogin' },
    },

    emailRegex: require('./util/Form').prototype.emailRegex,

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
        validate: val => val.length
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

    instances: { },

    loginFields: [
        { name: "email", label: 'Email', type: 'text', error: "Please enter a valid email address.", validate: function( val ) { return this.emailRegex.test(val) } },
        { name: "password", label: 'Password', type: 'password', error: "Passwords must be at least 6 characters long.", validate: function( val ) { return val.length >= 6 } }
    ],

    modalFormFail: function( error ) {
        console.log( error.stack || error );
        this.slurpTemplate( { template: this.templates.serverError( error ), insertion: { $el: this.$('.modal-body') } } )
    },

    modalLogin: require('../templates/modalLogin')( require('handlebars') ),

    modalSubmissionResponse( response ) {
        
        if( Object.keys( response ).length === 0 ) {            
            return this.slurpTemplate( { template: this.templates.invalidLoginError( response ), insertion: { $el: this.$('.modal-body') } } )
        }
        
        //this.$(document).off( 'keyup', this.checkForEnter.bind(this) )
    
        require('../models/User').set( response );
        this.emit( "success" );
        
        this.modalView.hide( { reset: true } )
        this.templateData.memberInfo.hide()
        this.templateData.alreadyMemberHeader.show()
    },

    postRender() {
        var currentViewName

        if( ! this.currentIndex ) this.currentIndex = 0

        currentViewName = this.views[ this.currentIndex ].name

        if( this.instances[ currentViewName ] ) return this.instances[ currentViewName ].show()

        this.instances[ currentViewName ] = new this.views[ this.currentIndex ].view( { container: this.templateData.walkthrough } )

        return

        this.shares = new ( this.Collection.extend( { url: "/share" } ) )()

        this.templateData.container.find('input').on( 'blur', function() {
            var $el = self.$(this),
                valid = self._( self.fields ).find( function( field ) { return field.name === $el.attr('id') } )
                        .validate.call( self, $el.val() )

            if( valid ) {
                $el.parent().parent().removeClass('has-error').addClass('has-feedback has-success')
                $el.next().removeClass('hide').removeClass('glyphicon-remove').addClass('glyphicon-ok')
            } else {
                $el.parent().parent().removeClass('has-success').addClass('has-feedback has-error')
                $el.next().removeClass('hide').removeClass('glyphicon-ok').addClass('glyphicon-remove')
            }
        } )

        this.shares.fetch()
            .done( () => this.shares.forEach( share => {

                this.slurpTemplate( {
                    insertion: { $el: this.templateData.shares },
                    template: this.templates.share( share.attributes )
                } )

                share.set( { shareoptionids: new ( this.Collection.extend( { url: "/shareoptionshare" } ) )() } )
                share.get('shareoptionids').fetch( { data: { shareid: share.id } } ).done( () => {
                    share.set( { shareoptions: new ( this.Collection.extend( { url: "/shareoption" } ) )() } )
                    if( share.get('shareoptionids') ) {
                        share.get('shareoptions')
                            .fetch( { data: { id: share.get('shareoptionids').map( shareoptionshare => shareoptionshare.get('shareoptionid') ).join(',') } } )
                            .done( () => Promise.all( 
                                share.get('shareoptions').map( shareoption => {
                                    shareoption.set( { options: new ( this.Collection.extend( { url: "/shareoptionoption" } ) )() } )
                                    return new Promise( ( resolve, reject ) =>
                                        shareoption.get('options')
                                                   .fetch( { data: { shareoptionid: shareoption.id } } )
                                                   .done( resolve )
                                                   .fail( reject ) )
                                } )
                            ).then( () => this.renderShareOptions() ) )
                    }
                } )

                share.set( { deliveryoptionids: new ( this.Collection.extend( { url: "/sharedeliveryoption" } ) )() } )
                share.get('deliveryoptionids').fetch( { data: { shareid: share.id } } ).done( () => {
                    if( share.get('deliveryoptionids') ) {
                        share.set( { deliveryoptions: new ( this.Collection.extend( { url: "/deliveryoption" } ) )() } )
                        share.get('deliveryoptions')
                            .fetch( { data: { id: share.get('deliveryoptionids').map( sharedeliveryoption => sharedeliveryoption.get('deliveryoptionid') ).join(',') } } )
                            .done( () => this.renderDeliveryOptions() )
                    }
                } )
            } ) )
    },

    renderDeliveryOptions() {
        this.shares.forEach( share => {
            this.slurpTemplate( {
                insertion: { $el: this.templateData.deliveryOptions },
                template: this.templates.deliveryOptions( {
                    share: share.get('label'),
                    options: share.get('deliveryoptions').map( deliveryoption => ( {
                        id: deliveryoption.id,
                        label: deliveryoption.get('label')
                    } ) )
                } )
            } )
        } )
    },

    renderShareOptions() {

        this.shares.forEach( share => {
            this.slurpTemplate( {
                insertion: { $el: this.templateData.shareOptions },
                template: this.templates.shareOptions( {
                    share: share.get('label'),
                    options: share.get('shareoptions').map( shareoption => ( {
                        id: shareoption.id,
                        label: shareoption.get('label'),
                        options: shareoption.get('options').models.map( model => model.attributes ) } ) )
                } )
            } )
        } )
    },

    requiresLogin: false,

    showModalLogin() {
        this.modalView.show( {
            title: "Login",
            body: this.modalLogin( this.getTemplateOptions() ),
            cancelText: "Cancel",
            confirmText: "Log In"
        } ).on( 'submit', ( data ) => this.submitModalForm( data ) )

        this.$( '.modal-body' ).on( 'focus', '#email, #password', this.removeErrors.bind(this) )
        
    },

    submitModalForm( data ) {
        if( this.validateModalForm( data ) === false ) return
        this.postForm( { resource: 'auth', values: data } )
        .then( this.modalSubmissionResponse.bind(this) )
        .fail( this.modalFormFail.bind(this) )
        .done() 
    },

    template: require('../templates/signup')( require('handlebars') ),

    templates: {
        deliveryOptions: require('../templates/deliveryOptions')( require('handlebars') ),
        shareOptions: require('../templates/shareOptions')( require('handlebars') )
    },

    validateModalForm( data ) {
        
        var valid = true
        
        this.loginFields.forEach( field => {
            var id = field.name
            this.$('#' + id).parent().removeClass('has-error');
            this.$('#' + id).next().remove();

            if ( field.validate.call( this, data[ field.name ] ) === false ) {
                valid = false

                this.$('#' + id).parent().addClass('has-error');
                this.slurpTemplate( { template: this.templates.fieldError( field ), insertion: { $el: this.$('#' + id).parent(), method: 'append' } } )
          }

        }, this )
        
        return valid
    },

    views: [
        { name: 'shares', view: require('./signup/Shares') }
    ]

} )

module.exports = Signup
