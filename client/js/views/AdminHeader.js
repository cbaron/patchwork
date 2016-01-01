var MyView = require('./MyView'),
    Header = function() { return MyView.apply( this, arguments ) }

Object.assign( Header.prototype, MyView.prototype, {

    events: {
        'signoutBtn': { event: 'click', selector: '', method: 'signout' }
    },

    getTemplateOptions() { return { logo: '/static/img/logo.gif' } },

    hide: function() {

        return this.Q.Promise( function( resolve, reject ) {
            this.templateData.container.hide( 10, () => {
                this.hidden = true
                this.size()
                resolve();
            } );

        }.bind(this) );
    },

    insertionMethod: 'before',

    onUser: function( user ) {
        this.user = user

        /*            
        this.templateData.name.text( this.user.get('name') )
        this.templateData.signoutBtn.removeClass('hide')
        */
    },
    
    requiresLogin: false,

    signout: function() {

        /* TODO: disconnect socket */

        this.Q.fcall( this.user.destroy.bind(this.user), { headers: { token: this.user.get('token') } } )
        .then( function() {
            this.templateData.name.text('')
            this.templateData.signoutBtn.addClass('hide')
            this.user.clear()
            this._.each( this.router.views, ( view, name ) => {
                view.delete()
                delete this.router[ name ]
            } )
            this.router.navigate( "/", { trigger: true } )
        }.bind(this) )
        .fail( err => console.log( "Error signing out : " + err.stack || err ) )
        .done()
    },

    template: require('../templates/adminHeader')( require('handlebars') )

} )

module.exports = new Header()
