module.exports = new (
    require('backbone').Router.extend( {

        Error: require('./MyError'),

        initialize: function() {

            this.user = require('./models/User');

            this.userPromise = new Promise( ( resolve, reject ) => this.user.fetch().done( resolve ).fail( reject ) )

            this.views = { }

            return this;
        },

        handler: function( resource ) {

            this.header = require('./views/Header')

            if( !resource ) return this.navigate( 'home', { trigger: true } )
          
            this.userPromise.then( () => {

                if( this.user.id ) this.header.onUser( this.user )

                if( this.views[ resource ] ) return this.views[ resource ].show()

                this.views[ resource ] = new ( this.resources[ resource ] )()

            } ).catch( err => new this.Error(err) )
        },
        
        Q: require('q'),

        resources: {
            admin: require('./views/Admin'),
            //about: require('./views/About'),
            //home: require('./views/Home')
        },

        routes: {
            '': 'handler',
            ':resource': 'handler'
        }

    } )
)()
