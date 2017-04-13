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
        this.total = 0

        this.total += this.weeksRemovedPrice
        this.total += this.weeksAddedPrice

        if( this.weeklyPriceAdjustment ) this.total += this.optionsAdjustment
        
        this.els.adjustment.textContent = this.Currency.format( this.total )
        if( this.total < 0 ) this.els.adjustment.classList.add('is-negative')

        return this
    },

    getPatchData() {
        return {
            value: this.total,
            description: this.description
        }
    },

    onOptionsReset() {
        this.weeklyPriceAdjustment = false
        this.els.options.classList.add('fd-hidden')

        this.displayTotal()

        if( this.els.weeksRemoved.textContent == 0 && this.els.weeksAdded.textContent == 0 ) this.els.container.classList.add('fd-hidden')
    },

    onWeeksReset() {
        this.els.weeksRemoved.textContent = '0'
        this.els.weeksAdded.textContent = '0'

        if( this.els.options.classList.contains('fd-hidden') ) return this.els.container.classList.add('fd-hidden')

        this.displayTotal()
    },

    onOptionsUpdate( { description, priceAdjustment } ) {

        this.description = description

        this.els.options.classList.remove('fd-hidden')

        this.weeklyPriceAdjustment = priceAdjustment
        this.els.weeklyAdjustment.textContent = this.Currency.format( priceAdjustment )
        this.els.shareOptionDescription.textContent = description
        
        this.updateOptionsAdjustment()

        this.displayTotal().show()
    },

    onWeekUpdate( { added, removed } ) {
        this.weeksAffected = this.originalWeeksAffected - removed - added
        this.els.weeksAffected.textContent = this.weeksAffected
        
        this.els.weeksRemoved.textContent = removed
        this.els.weeksAdded.textContent = added

        if( added == 0 && removed == 0 && !this.weeklyPriceAdjustment ) return this.els.container.classList.add('fd-hidden')

        this.weeksAddedPrice = added * ( this.originalWeeklyPrice + ( this.weeklyPriceAdjustment || 0 ) )
        this.els.weeksAddedPrice.textContent = this.Currency.format( this.weeksAddedPrice )

        this.weeksRemovedPrice = -1 * removed * this.originalWeeklyPrice
        this.els.weeksRemovedPrice.textContent = this.Currency.format( this.weeksRemovedPrice )

        this.updateOptionsAdjustment()
        
        this.displayTotal().show()
    },

    postRender() {
        this.description = ''
        this.els.weeksAdded.textContent = 0
        this.els.weeksRemoved.textContent = 0
        this.weeksRemovedPrice = 0
        this.weeksAddedPrice = 0
        this.els.weeksRemovedPrice.textContent = this.Currency.format( this.weeksRemovedPrice )
        this.els.weeksAddedPrice.textContent = this.Currency.format( this.weeksAddedPrice )

        this.views.buttonFlow.on( 'confirmBtnClicked', () => this.emit( 'patchMemberShare' ) )

        return this
    },

    reset() {
        this.description = ''
        this.els.weeksAdded.textContent = 0
        this.els.weeksRemoved.textContent = 0
        this.weeksRemovedPrice = 0
        this.els.weeksRemovedPrice.textContent = this.Currency.format( this.weeksRemovedPrice )
        this.hide()
    },

    setOriginalWeeklyPrice( price ) {
        this.originalWeeklyPrice = price
    },

    setWeeksAffected( { selectable, skipped } ) {
        this.originalWeeksAffected = selectable
        this.weeksAffected = selectable - skipped
        this.els.weeksAffected.textContent = this.weeksAffected
    },

    updateOptionsAdjustment() {
        this.optionsAdjustment = this.weeksAffected * this.weeklyPriceAdjustment
        this.els.optionsAdjustment.textContent = this.Currency.format( this.optionsAdjustment )
        this.els.optionsAdjustment.classList.add( this.optionsAdjustment < 0 ? 'is-negative' : 'is-positive' )
    }

} )
