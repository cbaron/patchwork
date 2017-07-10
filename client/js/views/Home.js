module.exports = Object.assign( {}, require('./__proto__'), {

    events: {
        joinBtn: 'click'
    },

    loadBgImage() {
        const img = new Image()

        img.onload = () => this.els.container.classList.add('bg-loaded')
        img.src = this.Format.ImageSrc( 'cornucopia.jpg' )
    },

    onJoinBtnClick() { this.emit( 'navigate', 'sign-up' ) },

    postRender() {
        this.loadBgImage()

        return this
    }

} )
