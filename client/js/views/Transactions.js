module.exports = Object.assign( {}, require('./__proto__'), {

    clear() { this.els.transactions.innerHTML = '' },

    events: {
        addBtn: 'click',
        cancelBtn: 'click',
        list: 'click'
    },

    insertTransaction( transaction ) {
        this.slurpTemplate( { template: this.templates.Transaction( transaction, this.Currency.format ), insertion: { el: this.els.transactions } } )
    },

    model: require('../models/CsaTransaction'),

    onAddBtnClick() {
        if( this.state === 'confirming' ) {
            this.model.post( [ 'action', 'value', 'checkNumber', 'description' ].reduce( ( memo, attr ) => Object.assign( memo, { [ attr ]: this.els[attr].value } ), { } ) )
            .then( () => {
                this.insertTransaction( this.model.data[ this.model.data.length - 1 ] )
                this.updateBalance()
                this.els.addBtn.textContent( 'Add Transaction' )
                this.state = ''
                this.Toast.showMessage( 'success', 'Transaction added!' )
            } )
            .catch( e => { this.Error(e); this.Toast.showMessage( 'error', 'Error adding transaction' ) } )
                        
        } else if( this.state === 'adding' ) {
            this.els.cancelBtn.classList.add('hidden')
            this.els.addBtn.textContent = 'Are you sure?'

            this.state === 'confirming'
        } else if( !this.state ) {
            this.els.cancelBtn.classList.remove('hidden')
            this.els.addTransactionRow.classList.remove('hidden')

            this.state === 'adding'
        }
    },

    onListClick( e ) {
        if( this.currentSelection ) this.currentSelection.classList.remove('selected')
        
        const el = e.target
        this.currentSelection = el
        el.classList.add( 'selected' )
        this.emit( 'selected', { customer: this.customer, share: this.MemberSeason.data.find( season => season.id == el.getAttribute('data-id') ) } )
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
        this.els.balance.textContent = this.Currency.format( this.model.getBalance() )
        return this
    }

} )
