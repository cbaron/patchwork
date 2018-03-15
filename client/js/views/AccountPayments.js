module.exports = Object.assign( {}, require('./__proto__'), {

    Customer: require('../models/Customer'),
    Transactions: require('../models/CsaTransaction'),

    Views: {
        creditCard() {
            return {
                model: Object.create( this.Model ).constructor( { }, {
                    attributes: require('../../../models/CreditCard').attributes,
                    meta: {
                        noPlaceholder: true
                    },
                    resource: 'payment'
                } ),
                templateOpts() {
                    return {
                        prompt: 'Please enter your credit card information.'
                    }
                },
                toastSuccess: 'Thank you for your payment! You will receive an email receipt shortly.'
            }
        }
    },

    events: {
        views: {
            creditCard: [
                [ 'posted', function() {
                    console.log( this.views.creditCard.model.data )
                    this.views.seasons.select( this.memberShareId )
                } ]
            ]
        }
    },

    clear() {
        this.els.total.textContent = ''
        this.els.ccWrapper.classList.add('fd-hidden')
    },

    postRender() {
        this.Customer.get( { query: { email: this.user.get('email'), 'id': { operation: 'join', value: { table: 'member', column: 'personid' } } } } )
        .then( () => {
            const customer = this.Customer.data[0]
            if( !customer ) return

            this.views.creditCard.model.set( 'member', customer.member.data )
            this.views.creditCard.model.set( 'person', customer.person.data )

            this.selectedCustomer = customer

            this.views.seasons.on( 'selected', data => {
                this.selectedShare = data.share
                this.memberShareId = this.selectedShare.membershareid
                this.Transactions.get( { query: { memberShareId: this.memberShareId } } )
                .then( () => {
                    this.views.creditCard.model.set( 'share', this.selectedShare )

                    this.balance = this.Transactions.getBalance()
                    this.views.creditCard.model.set( 'total', this.balance )

                    this.els.total.textContent = `Remaining Balance: ${this.Currency.format( this.balance )}`
                    this.slideIn( this.els.total, 'right' )

                    this.els.ccWrapper.classList.toggle( 'fd-hidden', this.balance <= 0 )
                    if( this.balance > 0 ) this.slideIn( this.els.ccWrapper, 'right' )
                } )
                .catch( this.Error )
            } )

            this.views.seasons.update( customer )
        } )
        .catch( this.Error )

        return this
    },

    update( customer, share, memberShareId ) {
        this.selectedCustomer = customer
        return this.views.seasons.update( customer )
        .then( () => this.views.seasons.select( memberShareId ) )
        .catch( this.Error )
    }

} )