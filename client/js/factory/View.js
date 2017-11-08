module.exports = Object.create( {

    create( rawName, opts ) {
        const name = this._processName( rawName )

        return Object.create(
            this.Views[ name ],
            Object.assign( {
                Dragger: { value: this.Dragger },
                Header: { value: this.Header },
                Toast: { value: this.Toast },
                documentName: { value: rawName },
                name: { value: name },
                factory: { value: this },
                range: { value: this.range },
                template: { value: this.Templates[ name ] },
                user: { value: this.User }
            } )
        ).constructor( opts )
    },

    _processName( name ) {
        let hyphen = name.indexOf('-')
        if( hyphen !== -1 ) return name.charAt(0).toUpperCase() + name.slice( 1, hyphen ) + name.charAt(hyphen + 1).toUpperCase() + name.slice( hyphen + 2 )
        
        return name.charAt(0).toUpperCase() + name.slice(1)
    },

}, {
    Dragger: { value: require('../views/Dragger') },
    Header: { value: require('../views/Header') },
    Templates: { value: require('../.TemplateMap') },
    Toast: { value: require('../views/Toast') },
    User: { value: require('../models/User') },
    Views: { value: require('../.ViewMap') }
} )
