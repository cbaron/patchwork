const CustomContent = require('./util/CustomContent')

module.exports = Object.assign( {}, require('./__proto__'), CustomContent, {

    events: {
        joinBtn: 'click'
    },

    onJoinBtnClick() { this.emit( 'navigate', 'sign-up' ) },

    postRender() {
        this.on( 'imgLoaded', () => this.els.container.classList.add('img-loaded') )

        return CustomContent.postRender.call(this)
    }

} )
