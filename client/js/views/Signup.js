var MyView = require('./MyView'),
    Signup = function() { return MyView.apply( this, arguments ) }

Object.assign( Signup.prototype, MyView.prototype, {

    events: {
        'alreadyMember': { event: 'click', selector: '', method: 'showModalLogin' },
    },

    fields: [
        { name: 'name', label: 'Name', type: 'text', error: "Name is a required field.", validate: function( val ) { return this.$.trim(val) !== '' } },
        { name: 'email', label: 'Email', type: 'text', error: "Please enter a valid email address.", validate: function( val ) { return this.emailRegex.test(val) } },
        { name: 'phonenumber', label: 'Phone Number', type: 'text', validate: function() { } },
        { name: 'address', label: 'Address', type: 'text', validate: function() { } },        
    ],

    getTemplateOptions() { return { fields: this.fields } },

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
        this.shares = new ( this.Collection.extend( { url: "/share" } ) )()

        this.shares.fetch()
            .done( () => this.shares.forEach( share => {

                console.log("sup")

                this.slurpTemplate( {
                    insertion: { $el: this.templateData.shares },
                    template: this.templates.share( share.attributes )
                } )

                share.set( { shareoptionids: new ( this.Collection.extend( { url: "/shareoptionshare" } ) )() } )
                share.get('shareoptionids').fetch( { data: { shareid: share.id } } ).done( () => {
                    share.set( { shareoptions: new ( this.Collection.extend( { url: "/shareoption" } ) )() } )
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
                } )
            } ) )
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
        share: require('../templates/share')( require('handlebars') ),
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
    }

} )

module.exports = Signup
