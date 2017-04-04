module.exports = Object.assign( {}, require('./__proto__'), {

    Views: {
        editButtons: { model: { value: {
            hide: true,
            states: {
                start: [
                    { name: 'edit', svg: require('./templates/lib/edit'), emit: true, nextState: 'onEdit' },
                    { name: 'ex', svg: require('./templates/lib/ex'), nextState: 'onDelete' }
                ],
                onDelete: [
                    { name: 'confirmDelete', text: 'Delete', class: 'link', emit: 'true' },
                    { name: 'cancelDelete', text: 'Cancel', class: 'link', nextState: 'start', emit: true }
                ],
                onEdit: [
                    { name: 'confirmEdit', text: 'Update', class: 'link', emit: 'true' },
                    { name: 'cancelEdit', text: 'Cancel', class: 'link', nextState: 'start', emit: true }
                ]
            }
        } } },
        emailButtons: { model: { value: {
            hide: true,
            states: {
                start: [ { name: 'sendEmail', text: 'Send Email Reminder', nextState: 'confirm' } ],
                confirm: [
                    { name: 'confirmEmail', text: 'Are you Sure?', emit: true, nextState: 'start' },
                    { name: 'cancel', nextState: 'start', text: 'Cancel' }
                ]
            }
         } } },
        addTransaction: function() { return { model: { value: this.model } } },
    },

    addTransaction() {
        this.model.post( Object.assign(
            { memberShareId: this.share.membershareid },
            this.model.attributes.reduce( ( memo, attr ) => Object.assign( memo, { [ attr ]: this.els[attr].value } ), { } )
        ) )
        .then( response => {
            this.insertTransaction( response.id )
            this.updateBalance()
            this.Toast.showMessage( 'success', 'Transaction added!' )
        } )
        .catch( e => { this.Error(e); this.Toast.showMessage( 'error', 'Error adding transaction' ) } )
    },

    clear() { this.els.transactions.innerHTML = '' },

    events: {
        list: 'click',
        transaction: [ 'mouseenter', 'mouseleave' ]
    },

    appendTransaction( transaction ) {
        this.slurpTemplate( {
            template: this.templates.Transaction(
                transaction,
                { currency: this.Currency.format, moment: this.Moment } ),
            insertion: { el: this.els.transactions }
         } )
    },

    insertTransaction( transactionId ) {
        const index = this.model.data.findIndex( datum => datum.id == transactionId ),
            children = Array.from( this.els.transactions.children ),
            insertion = index === 0
                ? { el: children[0], method: 'insertBefore' }
                : { el: children[ index - 1 ], method: 'after' }

        this.slurpTemplate( {
            template: this.templates.Transaction( this.model.data[ index ], { currency: this.Currency.format, moment: this.Moment } ),
            insertion
         } )
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
            .then( response => {
                this.insertTransaction( response.id )
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

    onTransactionMouseenter( e ) {
        if( this.views.editButtons.state !== 'start' ) return
        e.target.children[0].appendChild( this.views.editButtons.els.container )
        this.views.editButtons.els.container.classList.remove('fd-hidden', 'fd-hide')
    },
    
    onTransactionMouseleave( e ) {
        if( this.views.editButtons.state !== 'start' ) return
        this.els.transactions.after( this.views.editButtons.els.container )
        this.views.editButtons.els.container.classList.add('fd-hidden')
    },

    postRender() {

        this.views.emailButtons.on( 'confirmEmailClicked', e => this.sendMail() )

        this.model.on( 'added', datum => this.onModelAdd( datum ) )

        return this
    },

    

    onCancelAddTransaction() {
        this.els.addTransactionRow.classList.add('hidden')
        this.model.attributes.forEach( attr => this.els[ attr ].value = attr === 'action' ? this.model.actions[0] : '' )
    },

    onModelAdd( datum ) {
        this.insertTransaction( datum.id )
        this.updateBalance()
    },

    sendMail() {
        return this.Xhr( {
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

    

    templates: {
        Transaction: require('./templates/CsaTransaction')
    },

    update( { customer, share } ) {
        this.customer = customer
        this.share = share
      
        this.clear()

        this.model.get( { query: { memberShareId: share.membershareid } } )
        .then( () => this.model.data.forEach( csaTransaction => this.appendTransaction( csaTransaction ) ) )
        .then( () => this.updateBalance().show() )
        .catch( this.Error )

        this.views.addTransaction.update( share.membershareid )
    },

    updateBalance() {
        const balance = this.model.getBalance()
        this.els.balance.textContent = this.Currency.format( balance )

        if( balance > 0 ) { this.views.emailButtons.show() }
        else { this.views.buttonFlow.hide() }

        return this
    }

} )
