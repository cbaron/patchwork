module.exports = Object.assign( {}, require('./__proto__'), {

    Views: {
        buttonFlow: { model: { value: {
            states: {
                start: [ { name: 'save', text: 'Save Changes', class:'save-btn', nextState: 'confirm' } ],
                confirm: [
                    { name: 'confirmBtn', class:'save-btn', text: 'Are you Sure?', emit: true, nextState: 'start' },
                    { name: 'cancel', class:'reset-btn', nextState: 'start', text: 'Cancel' }
                ]
            }
         } } }
    },

    displayTotal() {
        let total = 0

        total -= parseInt( this.els.weeksRemoved.textContent ) * this.originalWeeklyPrice
        
        if( this.weeklyPriceAdjustment ) {
            total += this.optionsAdjustment
        } else {
            total += parseInt( this.els.weeksAdded.textContent ) * this.originalWeeklyPrice
        }
        
        this.els.adjustment.textContent = this.Currency.format( total )
        if( total < 0 ) this.els.adjustment.classList.add('is-negative')

        return this
    },

    onOptionsReset() {
        this.weeklyPriceAdjustment = false
        this.els.options.classList.add('fd-hidden')

        this.displayTotal()

        if( this.els.weeksRemoved.textContent == 0 && this.els.weeksAdded.textContent == 0 ) this.els.container.classList.add('fd-hidden')
    },

    onOptionsUpdate( { description, priceAdjustment } ) {

        this.els.options.classList.remove('fd-hidden')
        
        this.weeklyPriceAdjustment = priceAdjustment
        this.els.weeklyAdjustment.textContent = this.Currency.format( priceAdjustment )
        this.els.shareOptionDescription.textContent = description
        
        this.optionsAdjustment = parseInt( this.els.weeksAffected.textContent ) * this.weeklyPriceAdjustment
        this.els.optionsAdjustment.textContent = this.Currency.format( this.optionsAdjustment )
        this.els.optionsAdjustment.classList.add( this.optionsAdjustment < 0 ? 'is-negative' : 'is-positive' )

        this.displayTotal().show()
    },

    postRender() {
        this.els.weeksAdded.textContent = 0
        this.els.weeksRemoved.textContent = 0
        this.els.weeksRemovedPrice.textContent = this.Currency.format( 0 )

        this.views.buttonFlow.on( 'confirmBtnClicked', () => this.emit( 'patchMemberShare' ) )

        return this
    },

    setOriginalWeeklyPrice( price ) {
        this.originalWeeklyPrice = price
    },

    setWeeksAffected( i ) {
        this.els.weeksAffected.textContent = i
    }

} )
