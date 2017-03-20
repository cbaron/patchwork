module.exports = Object.create( {

    create( name, opts ) {
        const lower = name
        name = this._processName( name )

        return Object.create(
            this.Views[ name ],
            Object.assign( {
                name: { value: name },
                factory: { value: this },
                template: { value: this.Templates[ name ] },
                Toast: { value: this.Toast },
                user: { value: this.User }
            }, opts )
        ).constructor()
    },

    _processName( name ) {
        let hyphen = name.indexOf('-')
        if( hyphen !== -1 ) return name.charAt(0).toUpperCase() + name.slice( 1, hyphen ) + name.charAt(hyphen + 1).toUpperCase() + name.slice( hyphen + 2 )
        
        return name.charAt(0).toUpperCase() + name.slice(1)
    },

}, {
    Templates: { value: require('../.TemplateMap') },
    Toast: { value: require('../views/Toast') },
    Views: { value: require('../.ViewMap') },
    User: { value: require('../models/User') }
} )
