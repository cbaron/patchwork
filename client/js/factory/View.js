module.exports = Object.create( {

    create( name, opts ) {
        const lower = name
        name = this._processName(  )

        return Object.create(
            this.Views[ name ],
            Object.assign( {
                name: { value: name },
                factory: { value: this },
                template: { value: this.Templates[ lower ] },
                Toast: { value: this.Toast },
                //user: { value: this.User }
            }, opts )
        ).constructor()
    },

    _processName( name ) {
        let hypen = name.indexOf('-')
        if( hyphen !== -1 ) return name.charAt(0).toUpperCase() + name.slice( 0, hypen - 1 ) + name.charAt(hypen + 1).toUpperCase() + name.slice( hypen + 2 )
        
        return name.charAt(0).toUpperCase() + name.slice(1)
    },

}, {
    Templates: { value: require('../.TemplateMap') },
    Toast: { value: require('../views/Toast') },
    Views: { value: require('../.ViewMap') }
} )
