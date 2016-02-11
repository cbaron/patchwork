var MyView = require('./MyView'),
    Signup = function() { return MyView.apply( this, arguments ) }

Object.assign( Signup.prototype, MyView.prototype, {

    events: {
        'rightBtn': { method: 'validateView' },
    },

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
        
        if( ! this.currentIndex ) this.currentIndex = 0

        this.signupData = { }

        return this.showProperView()

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

    showNext() {
        this.instances[ this.views[ this.currentIndex ].name ].hide()

        this.currentIndex += 1

        this.showProperView()
    },

    showProperNav() {
        var left = this.templateData.leftBtn, right = this.templateData.rightBtn
        if( this.currentIndex === 0 ) {
            left.hide()
            if( right.is(':hidden') ) right.show()
        }
        else if( this.currentIndex === this.views.length - 1 ) {
            right.hide()
            if( left.is(':hidden') ) left.show()
        } else {
            if( left.is(':hidden') ) left.show()
            if( right.is(':hidden') ) right.show()
        }
    },

    showProperView() {
        var currentViewName = this.views[ this.currentIndex ].name

        this.showProperNav()

        if( this.instances[ currentViewName ] ) return this.instances[ currentViewName ].show()

        this.instances[ currentViewName ] =
            new this.views[ this.currentIndex ].view( {
                container: this.templateData.walkthrough,
                signupData: this.signupData 
            } )

        return this
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

    validateView() {
        if( this.instances[ this.views[ this.currentIndex ].name ].validate() ) this.showNext()
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
        { name: 'shares', view: require('./signup/Shares') },
        { name: 'memberInfo', view: require('./signup/MemberInfo') },
        { name: 'shareOptions', view: require('./signup/ShareOptions') },
        { name: 'delivery', view: require('./signup/Delivery') }
    ]

} )

module.exports = Signup
