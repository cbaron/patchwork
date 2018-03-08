module.exports = Object.assign( {}, require('./__proto__'), {

    Pikaday: require('pikaday'),
    
    Templates: {
        Transaction: require('./templates/CsaTransaction'),
        EditTransaction: require('./templates/EditCsaTransaction')
    },

    Views: {
        editButtons() {
            return {
                model: Object.create( this.Model ).constructor( {
                    hide: true,
                    states: {
                        start: [
                            { name: 'edit', svg: require('./templates/lib/edit')(), emit: true, nextState: 'onEdit' },
                            { name: 'garbage', svg: require('./templates/lib/garbage')(), nextState: 'onDelete', emit: true }
                        ],
                        onDelete: [
                            { name: 'confirmDelete', class: 'link', 'text': 'Delete?', nextState: 'start', emit: 'true' },
                            { name: 'cancelDelete', svg: require('./templates/lib/ex')( { name: 'cancelDelete' } ), nextState: 'start', emit: true }
                        ],
                        onEdit: [
                            { name: 'confirmEdit', class: 'link', 'text': 'Edit', emit: 'true', nextState: 'start' },
                            { name: 'cancelEdit', svg: require('./templates/lib/ex')( { name: 'cancelEdit' } ), nextState: 'start', emit: true }
                        ]
                    }
                } )
            }
        },
        emailButtons() {
            return {
                model: Object.create( this.Model ).constructor( {
                    hide: true,
                    states: {
                        start: [ { name: 'sendEmail', class: 'save-btn', text: 'Send Email Reminder', nextState: 'confirm' } ],
                        confirm: [
                            { name: 'confirmEmail', class: 'save-btn', text: 'Are you Sure?', emit: true, nextState: 'start' },
                            { name: 'cancel', nextState: 'start', class: 'reset-btn', text: 'Cancel' }
                        ]
                    }
                } )
            }
        },
        addTransaction: function() { return { model: this.model } },
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
            template: this.Templates.Transaction(
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
            template: this.Templates.Transaction( this.model.data[ index ], { currency: this.Currency.format, moment: this.Moment } ),
            insertion
         } )
    },

    editTransaction( e ) {
        const el = e.target.closest('li'),
            id = el.getAttribute('data-id') 

        return Promise.all( [
            this.model.patch(
                id,
                this.model.attributes.reduce( ( memo, attr ) =>
                    Object.assign( memo, { [ attr ]:
                        attr === 'created'
                            ? this.Moment( this.els.editTransaction.querySelector(`[data-attr="created"]`).value, 'MMM D, YYYY' ).format('YYYY-MM-DD')
                            : this.els.editTransaction.querySelector(`[data-attr="${attr}"]`).value
                    } ),
                    { }
                )
            ),
            e.fdNextState
        ] )
        .then( datum => {
            this.removeEditRow()
            this.moveOutEditButtons()
            el.remove()
            this.insertTransaction(id)
            this.updateBalance()
            this.Toast.showMessage( 'success', 'Transaction edited!' )
        } )
        .catch( e => {
            this.removeEditRow()
            this.Error(e);
            this.Toast.showMessage( 'error', 'Error editing transaction' )
        } )
    },

    deleteTransaction( e ) {
        const id = e.target.closest('li').getAttribute('data-id') 

        Promise.all( [
            this.model.delete( id ),
            e.fdNextState
        ] )
        .then( () => {
            this.moveOutEditButtons()
            this.els.transactions.querySelector(`li[data-id="${id}"]`).remove()
            this.updateBalance()
            this.Toast.showMessage( 'success', 'Transaction deleted!' )
        } )
        .catch( e => {
            this.Error(e);
            this.Toast.showMessage( 'error', 'Error adding transaction' )
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
        if( e.target.tagName !== "LI" ) return
        if( this.views.editButtons.state !== 'start' ) return
        e.target.children[0].appendChild( this.views.editButtons.els.container )
        this.views.editButtons.els.container.classList.remove('fd-hidden')
    },
    
    onTransactionMouseleave( e ) {
        if( e.target.tagName !== "LI" ) return
        if( this.views.editButtons.state !== 'start' ) return
        this.moveOutEditButtons()
    },

    moveOutEditButtons() {
        this.els.transactions.after( this.views.editButtons.els.container )
        this.views.editButtons.els.container.classList.add('fd-hidden')
    },

    postRender() {

        this.views.emailButtons.on( 'confirmEmailClicked', e => this.sendMail() )

        this.views.editButtons.on( 'editClicked', e => this.createEditRow( e ) )
        this.views.editButtons.on( 'cancelEditClicked', e => this.removeEditRow( e ) )
        this.views.editButtons.on( 'confirmEditClicked', e => this.editTransaction( e ) )

        this.views.editButtons.on( 'garbageClicked', e => this.toggleDeleteStyle( e, true ) )
        this.views.editButtons.on( 'cancelDeleteClicked', e => this.toggleDeleteStyle( e, false ) )
        this.views.editButtons.on( 'confirmDeleteClicked', e => this.deleteTransaction( e ) )

        this.model.on( 'added', datum => this.onModelAdd( datum ) )

        return this
    },

    createEditRow( e ) {
        this.editedRow = e.target.closest('li')
        this.editedRow.classList.add('confirming-edit')

        const model = this.model.data.find( datum => datum.id == this.editedRow.getAttribute('data-id') )

        this.slurpTemplate( {
            insertion: { el: this.editedRow, method: 'after' },
            template: this.Templates.EditTransaction(
                this.model.attributes.reduce( ( memo, attr ) =>
                    Object.assign( memo, { [ attr ]:
                        attr === 'created'
                            ? this.Moment( model.created ).format('MMM D, YYYY')
                            : model[ attr ]
                    } ),
                    { actions: this.model.actions }
                )
            )
        } )

        this.created = new this.Pikaday( { field: this.els.editTransaction.querySelector(`input[data-attr="created"]`), format: 'MMM D, YYYY' } )
    },

    removeEditRow( e ) {
        this.editedRow.classList.remove('confirming-edit')
        this.editedRow = undefined
        this.els.editTransaction.remove()
        delete this.els.editTransaction
    },

    toggleDeleteStyle( e, value ) {
        e.target.closest('li').classList.toggle( 'confirming-delete', value )
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
                to: this.customer.person.data.email,
                subject: `Patchwork Gardens ${this.share.label} Balance`,
                body: `According to our records, you have an outstanding balance of ${this.els.balance.textContent}.\r\n\r\nPlease send payment at your earliest convenience to Patchwork Gardens, 9057 W Third St, Dayton OH 45417.\r\n\r\nIf you believe this is incorrect, please contact us by email or phone (937) 835-5807.\r\n\r\nThank You.`
            } )
        } )
        .then( () => this.Toast.showMessage( 'success', 'Email sent.' ) )
        .catch( e => { this.Error(e); this.Toast.showMessage( 'error', 'Error sending email.' ) } )
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
        else { this.views.emailButtons.hide() }

        return this
    }

} )
