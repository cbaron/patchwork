module.exports = Object.assign( {}, require('./__proto__'), {

    onNextState( newState ) {
        this.hideEl( this.els[ this.state ] )
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
                this.els[ button.name ].addEventListener( 'click', e => {
                    if( button.nextState ) this.onNextState( button.nextState )
                    if( button.emit ) this.emit( `${button.name}Clicked` )
                } )
           } )
        )

        return this
    }
} )
