module.exports = Object.assign( {}, require('./__proto__'), {

    events: {
        joinBtn: 'click'
    },

    onJoinBtnClick() { this.emit( 'navigate', 'sign-up' ) },

    postRender() {
        this.on( 'imgLoaded', () => this.els.container.classList.add('img-loaded') )

        return this
    }

} )
