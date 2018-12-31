module.exports = { ...require('./__proto__'),

    events: {
        unsubscribeBtn: 'click'
    },

    emailRegex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,

    async onUnsubscribeBtnClick() {
        const email = this.els.email.value.trim()
        if( !this.emailRegex.test( email ) ) return this.Toast.showMessage( 'error', 'Please enter a valid email.' )
        
        try {
            const response = await this.Xhr( { method: 'delete', resource: 'newsletter', data: JSON.stringify( { email } ) } )
            this.Toast.showMessage( 'success', 'You have unsubscribed.' )
            this.els.email.value = ''
        } catch(err) {
            console.log( err.stack || err )
            this.Toast.showMessage( 'error', 'There was a problem unsubscribing. Please try again or contact us.' )
        }
    },

}