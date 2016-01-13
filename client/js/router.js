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

            this.header = ( resource === 'admin' ) ? require('./views/AdminHeader') : require('./views/Header')

            this.footer = require('./views/Footer')

            if( !resource ) return this.navigate( 'home', { trigger: true } )
          
            this.userPromise.then( () => {
                console.log('router being used')
                if( this.user.id ) this.header.onUser( this.user )
                console.log(this.views)
                if( this.views[ resource ] ) return this.views[ resource ].show()
                this.views[ resource ] = new ( this.resources[ resource ].view )( this.resources[ resource ].options )

            } ).catch( err => new this.Error(err) )
        },
        
        Q: require('q'),

        resources: {
            admin: { view: require('./views/Admin'), options: { url: "/", fetch: { headers: { accept: "application/ld+json" } } } },
            home: { view: require('./views/Home'), options: { } },
            signup: { view: require('./views/Signup'), options: { } },
            about: { view: require('./views/About'), options: { } },
            locations: { view: require('./views/Locations'), options: { } },
            members: { view: require('./views/Members'), options: { } },
            employment: { view: require('./views/Employment'), options: { } },
            contact: { view: require('./views/Contact'), options: { } }
        },

        routes: {
            '': 'handler',
            ':resource': 'handler'
        }

    } )
)()
