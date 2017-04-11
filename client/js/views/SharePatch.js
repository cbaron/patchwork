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

        if( this.weeklyPriceAdjustment ) {
            this.total += this.optionsAdjustment
        } else {
            this.total += this.weeksAddedPrice
        }
        
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

        this.els.addedAdjustment.classList.add( 'fd-hidden' )
        this.els.added.classList.remove( 'line-item' )
        
        this.weeklyPriceAdjustment = priceAdjustment
        this.els.weeklyAdjustment.textContent = this.Currency.format( priceAdjustment )
        this.els.shareOptionDescription.textContent = description
        
        this.optionsAdjustment = this.weeksAffected * this.weeklyPriceAdjustment
        this.els.optionsAdjustment.textContent = this.Currency.format( this.optionsAdjustment )
        this.els.optionsAdjustment.classList.add( this.optionsAdjustment < 0 ? 'is-negative' : 'is-positive' )

        this.displayTotal().show()
    },

    onWeekUpdate( { added, removed } ) {
        const areOptionUpdates = !this.els.options.classList.contains('fd-hidden')

        this.weeksAffected = this.originalWeeksAffected + ( added - removed )
        this.els.weeksAffected.textContent = this.weeksAffected
        
        this.els.addedAdjustment.classList.toggle( 'fd-hidden', areOptionUpdates )
        this.els.added.classList.toggle( 'line-item', !areOptionUpdates )

        this.els.weeksRemoved.textContent = removed
        this.els.weeksAdded.textContent = added

        if( added == 0 && removed == 0 && !this.weeklyPriceAdjustment ) return this.els.container.classList.add('fd-hidden')

        this.weeksAddedPrice = added * this.originalWeeklyPrice
        this.els.weeksAddedPrice.textContent = this.Currency.format( this.weeksAddedPrice )

        this.weeksRemovedPrice = -1 * removed * this.originalWeeklyPrice
        this.els.weeksRemovedPrice.textContent = this.Currency.format( this.weeksRemovedPrice )

        this.displayTotal().show()
    },

    postRender() {
        this.description = ''
        this.els.weeksAdded.textContent = 0
        this.els.weeksRemoved.textContent = 0
        this.weeksRemovedPrice = 0
        this.els.weeksRemovedPrice.textContent = this.Currency.format( this.weeksRemovedPrice )

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

    setWeeksAffected( i ) {
        this.originalWeeksAffected = i
        this.weeksAffected = i
        this.els.weeksAffected.textContent = i
    }

} )
