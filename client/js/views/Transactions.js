module.exports = Object.assign( {}, require('./__proto__'), {

    clear() { this.els.transactions.innerHTML = '' },

    events: {
        addBtn: 'click',
        cancelBtn: 'click',
        confirmEmailBtn: 'click',
        cancelEmailBtn: 'click',
        emailBtn: 'click',
        ex: 'click',
        list: 'click'
    },

    insertTransaction( transaction ) {
        this.slurpTemplate( { template: this.templates.Transaction( transaction, this.Currency.format ), insertion: { el: this.els.transactions } } )
    },

    model: require('../models/CsaTransaction'),

    onAddBtnClick() {
        if( this.state === 'confirmDelete' ) {
            this.model.delete( this.markedForDeletion  )
            .then( () => {
                this.els.transactions.querySelector(`li[data-id="${this.markedForDeletion}"]`).remove()
                this.updateBalance()
                this.Toast.showMessage( 'success', 'Transaction deleted!' )
                this.resetState()
            } )
        } else if( this.state === 'confirming' ) {
            this.model.post( Object.assign(
                { memberShareId: this.share.membershareid },
                this.model.attributes.reduce( ( memo, attr ) => Object.assign( memo, { [ attr ]: this.els[attr].value } ), { } )
            ) )
            .then( () => {
                this.insertTransaction( this.model.data[ this.model.data.length - 1 ] )
                this.updateBalance()
                this.Toast.showMessage( 'success', 'Transaction added!' )
                this.resetState()
            } )
            .catch( e => {
                this.Error(e);
                this.Toast.showMessage( 'error', 'Error adding transaction' )
                this.resetState()
            } )
                        
        } else if( this.state === 'adding' ) {

            this.els.addBtn.textContent = 'Are you sure?'
            this.state = 'confirming'

        } else if( !this.state ) {
            this.els.cancelBtn.classList.remove('hidden')
            this.els.addTransactionRow.classList.remove('hidden')

            this.state = 'adding'
        }
    },
    
    onCancelBtnClick() {
        this.resetState()
    },

    onCancelEmailBtnClick() {
        this.els.confirmEmail.classList.add( 'fd-hide', 'fd-hidden' )
        this.showEl( this.els.emailBtn ).catch( this.Error )
    },

    onConfirmEmailBtnClick() {
        this.onCancelEmailBtnClick()

        this.Xhr( {
            method: 'post',
            resource: 'mail',
            data: JSON.stringify( {
                to: this.customer.person.email,
                subject: `Patchwork Gardens ${this.share.label} Balance`,
                body: `According to our records, you have an outstanding balance of ${this.els.balance.textContent}.\r\n\r\nPlease send payment at your earliest convenience to Patchwork Gardens, 9057 W Third St, Dayton OH 45417.\r\n\r\nIf you believe this is incorrect, please contact us by email or phone (937) 835-5807.\r\n\r\nThank You.`
            } )
        } )
        .then( () => this.Toast.showMessage( 'success', 'Email sent.' ) )
        .catch( e => { this.Error(e); this.Toast.showMessage( 'error', 'Error sending email.' ) } )
    },

    onEmailBtnClick() {
        this.hideEl( this.els.emailBtn )
        .then( () => this.showEl( this.els.confirmEmail ) )
        .catch( this.Error )
    },

    onExClick( e ) {
        if( this.markedForDeletion ) return
        
        const item =  e.target.closest('li')

        this.markedForDeletion = item.getAttribute('data-id')
        item.classList.add('marked')
       
        this.els.addBtn.textContent = 'Confirm Delete' 
        this.els.cancelBtn.classList.remove('hidden')
        this.state = 'confirmDelete'
    },

    onListClick( e ) {
        if( this.currentSelection ) this.currentSelection.classList.remove('selected')
        
        const el = e.target
        this.currentSelection = el
        el.classList.add( 'selected' )
        this.emit( 'selected', { customer: this.customer, share: this.MemberSeason.data.find( season => season.id == el.getAttribute('data-id') ) } )
    },

    resetState() {
        this.els.addTransactionRow.classList.add('hidden')
        this.model.attributes.forEach( attr => this.els[ attr ].value = attr === 'action' ? this.model.actions[0] : '' )
        this.els.addBtn.textContent = 'Add Transaction'
        this.els.cancelBtn.classList.add('hidden')
        if( this.els.transactions.querySelector('.marked') ) this.els.transactions.querySelector('.marked').classList.remove('marked')
        this.markedForDeletion = undefined
        this.state = ''
    },

    templateOpts() {
        return { actions: this.model.actions }
    },

    templates: {
        Transaction: require('./templates/CsaTransaction')
    },

    update( { customer, share } ) {
        this.customer = customer
        this.share = share
      
        this.clear()

        this.model.get( { query: { memberShareId: share.membershareid } } )
        .then( () => this.model.data.forEach( csaTransaction => this.insertTransaction( csaTransaction ) ) )
        .then( () => this.updateBalance().show() )
        .catch( this.Error )
    },

    updateBalance() {
        const balance = this.model.getBalance()
        this.els.balance.textContent = this.Currency.format( balance )

        if( balance > 0 ) { this.showEl( this.els.emailBtn ) }
        else { this.hideEl( this.els.emailBtn ) }

        return this
    }

} )
