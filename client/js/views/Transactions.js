module.exports = Object.assign( {}, require('./__proto__'), {

    clear() { this.els.transactions.innerHTML = '' },

    events: {
        addBtn: 'click',
        cancelBtn: 'click',
        list: 'click',
        transaction: [ 'mouseenter', 'mouseleave' ]
    },

    insertTransaction( transaction ) {
        this.slurpTemplate( { template: this.templates.Transaction( transaction, this.Currency.format ), insertion: { el: this.els.transactions } } )
    },

    model: require('../models/CsaTransaction'),

    onAddBtnClick() {
        if( this.state === 'confirming' ) {
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

    onListClick( e ) {
        if( this.currentSelection ) this.currentSelection.classList.remove('selected')
        
        const el = e.target
        this.currentSelection = el
        el.classList.add( 'selected' )
        this.emit( 'selected', { customer: this.customer, share: this.MemberSeason.data.find( season => season.id == el.getAttribute('data-id') ) } )
    },

    onTransactionMouseenter( e ) { 
    },

    onTransactionMouseleave( e ) {
    },

    resetState() {
        this.els.addTransactionRow.classList.add('hidden')
        this.model.attributes.forEach( attr => this.els[ attr ].value = attr === 'action' ? this.model.actions[0] : '' )
        this.els.addBtn.textContent = 'Add Transaction'
        this.els.cancelBtn.classList.add('hidden')
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
        this.els.balance.textContent = this.Currency.format( this.model.getBalance() )
        return this
    }

} )
