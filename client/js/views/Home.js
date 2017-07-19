module.exports = Object.assign( {}, require('./__proto__'), {

    events: {
        joinBtn: 'click'
    },

    onJoinBtnClick() { this.emit( 'navigate', 'sign-up' ) }

} )
