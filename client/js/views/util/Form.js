var _ = require('underscore'),
    FormView = function() { return this }

_.extend( FormView.prototype, {

    emailRegex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,

    fields: [ ],

    onFormFail: function( error ) {
        console.log( error.stack || error );
        this.slurpTemplate( { template: this.templates.serverError( error ), insertion: { $el: this.templateData.buttonRow, method: 'before' } } )
    },

    onSubmissionResponse: function() { },
    
    postForm: function( data ) {

        return this.Q(
            this.$.ajax( {
                data: JSON.stringify( this.getFormData() ),
                headers: { token: ( this.user ) ? this.user.get('token') : '' },
                type: "POST",
                url: this.util.format( "/%s", data.resource )
            } )
        )
    },

    removeErrors: function( e ) {

        var input = this.$( e.target );
        input.parent().removeClass('has-error');
        input.next().remove();

    },

    submitForm: function( resource ) {
        
        if ( this.validateForm() === false ) return
        this.postForm(resource)
          .then( this.onSubmissionResponse.bind(this) )
          .fail( this.onFormFail.bind(this) )
          .done()
    
    },
    
    templates: { fieldError: require('../../templates/fieldError')( require('handlebars') ),
                 invalidLoginError: require('../../templates/invalidLoginError')( require('handlebars') ),
                 serverError: require('../../templates/serverError')(require('handlebars') ) },

    validateForm: function() {
        var valid = true
        
        if ( this.templateData.invalidLoginError ) this.templateData.invalidLoginError.remove();
        if ( this.templateData.serverError ) this.templateData.serverError.remove();

        this.fields.forEach( function( data ) {
          
          this.templateData[data.name].parent().removeClass('has-error');
          this.templateData[data.name].next().remove();

          if ( data.validate.call( this, this.templateData[data.name].val() ) === false ) {
            valid = false

            this.templateData[data.name].parent().addClass('has-error');
            this.slurpTemplate( { template: this.templates.fieldError( data ), insertion: { $el: this.templateData[data.name].parent(), method: 'append' } } )
          }

        }, this )
        
        return valid

    }

} );

module.exports = FormView
