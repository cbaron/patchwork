const CustomContent = require('./util/CustomContent')

module.exports = Object.assign( {}, require('./__proto__'), CustomContent, {

    events: {
        joinBtn: 'click',
        newsletterBtn: 'click'
    },

    emailRegex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,

    onJoinBtnClick() { this.emit( 'navigate', 'sign-up' ) },

    async onNewsletterBtnClick() {
        const email = this.els.email.value.trim()
        if( !this.emailRegex.test( email ) ) return this.Toast.showMessage( 'error', 'Please enter a valid email.' )
        
        try {
            const response = await this.Xhr( { method: 'post', resource: 'newsletter', data: JSON.stringify( { email } ) } )
            this.Toast.showMessage( 'success', 'You are now subscribed. Thank you!' )
            this.els.email.value = ''
        } catch(err) {
            console.log( err.stack || err )
            this.Toast.showMessage( 'error', 'There was a problem subscribing. Please try again or contact us.' )
        }
    },

    postRender() {
        this.on( 'imgLoaded', () => this.els.container.classList.add('img-loaded') )

        return CustomContent.postRender.call(this)
    }

} )
