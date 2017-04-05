module.exports = Object.assign( {}, require('./__proto__'), {

    disable() {
        Object.keys( this.model.states ).forEach( stateName =>
           this.model.states[ stateName ].forEach( button => {
               const el = this.els[ button.name ]
               el.removeEventListener( 'click', button.clickListener )
               el.classList.add('disabled')
           } )
        )
    },

    enable() {
        Object.keys( this.model.states ).forEach( stateName =>
           this.model.states[ stateName ].forEach( button => {
               const el = this.els[ button.name ]
               el.addEventListener( 'click', button.clickListener )
               el.classList.remove('disabled')
           } )
        )
    },

    getListener( name, button ) {
        return e => {
            if( button.nextState ) e.fdNextState = this.onNextState( button.nextState )
            if( button.emit ) this.emit( `${name}Clicked`, e )
        }
    },

    onNextState( newState ) {
        return this.hideEl( this.els[ this.state ] )
        .then( () => {
            this.showEl( this.els[ newState ] )
            return Promise.resolve( this.state = newState )
        } )
        .catch( this.Error )
    },

    postRender() {
        this.state = 'start'

        Object.keys( this.model.states ).forEach( stateName =>
           this.model.states[ stateName ].forEach( button => {
               const el = this.els[ button.name ]
                button.clickListener = this.getListener( button.name, button )
                if( !this.model.disabled ) { el.addEventListener( 'click', button.clickListener ) }
           } )
        )

        return this
    }
} )
