var MyView = require('./MyView'),
    Login = function() { return MyView.apply( this, arguments ) };

Object.assign( Login.prototype, MyView.prototype, require('./util/Form').prototype, {

    events: {
        'loginBtn': { event: 'click', selector: '', method: 'login' }
    },

    fields: [
            { name: "email", label: 'Email', type: 'text', error: "Please enter a valid email address.", validate: function( val ) { return this.emailRegex.test(val) } },
            { name: "password", label: 'Password', type: 'password', error: "Passwords must be at least 6 characters long.", validate: function( val ) { return val.length >= 6 } }
    ],

    getTemplateOptions: function() { return { fields: this.fields } },

    login: function() { this.submitForm( { resource: "auth" } ) },

    name: "Login",

    onSubmissionResponse: function( response ) {
        
        if( response.success === false ) {
            return this.slurpTemplate( { template: this.templates.invalidLoginError( response ), insertion: { $el: this.templateData.buttonRow, method: 'before' } } )
        }
    
        require('../models/User').set( response.result.member );
        this.emit( "success" );
        this.hide().done();
    },

    render: function() {
        MyView.prototype.render.call(this);
        this.templateData.container.find( 'input' ).on( 'focus', this.removeErrors.bind(this) )
    },

    requiresLogin: false,

    template: require('../templates/login')( require('handlebars') )

} );

module.exports = new Login()
