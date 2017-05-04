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

    getWhitespace( count ) {
        let rv = ""

        while( count > 0 ) { rv += " "; count-- }

        return rv
    },

    getDescription() {
        const lineWidth = 100,
            lines = [
                [ `Weeks Removed: ${this.els.weeksRemoved.textContent}`, `Adjustment: ${this.Currency.format(this.weeksRemovedPrice)}` ],
                [ `Weeks Added: ${this.els.weeksAdded.textContent}`, `Adjustment: ${this.Currency.format(this.weeksAddedPrice)}` ]
            ]

        return [ `${lines[0][0]}${this.getWhitespace( lineWidth - lines[0][0].length - lines[0][1].length )}${lines[0][1]}`,
                 `${lines[1][0]}${this.getWhitespace( lineWidth - lines[1][0].length - lines[1][1].length )}${lines[1][1]}`,
                `Options Update: ${this.optionsDescription}`,
                `Weekly price adjustment: ${this.Currency.format(this.weeklyPriceAdjustment)}`,
                `Weeks affected: ${this.weeksAffected}`
            ].join('\n')
    },

    getPatchData() {
        return {
            value: this.total,
            description: this.getDescription()
        }
    },

    onOptionsReset() {
        this.weeklyPriceAdjustment = false
        this.els.options.classList.add('fd-hidden')

        this.els.weeklyAdjustment.textContent = this.Currency.format( 0 )
        this.els.shareOptionDescription.textContent = ``

        this.displayTotal()

        if( this.els.weeksRemoved.textContent == 0 && this.els.weeksAdded.textContent == 0 ) this.els.container.classList.add('fd-hidden')
    },

    onWeeksReset() {
        this.onWeekUpdate( { added: 0, removed: 0 } )
    },

    onOptionsUpdate( { description, priceAdjustment } ) {

        this.optionsDescription = description

        this.els.options.classList.remove('fd-hidden')

        this.weeklyPriceAdjustment = priceAdjustment
        this.els.weeklyAdjustment.textContent = this.Currency.format( priceAdjustment )
        this.els.shareOptionDescription.textContent = description
        
        this.updateOptionsAdjustment()

        this.displayTotal().show()
    },

    onWeekUpdate( { added, removed } ) {
        this.weeksAffected = this.originalWeeksAffected - removed
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
        this.optionsDescription = ``
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
        this.optionsDescription = ``
        this.els.weeksAdded.textContent = 0
        this.els.weeksRemoved.textContent = 0
        this.weeksRemovedPrice = 0
        this.els.weeksRemovedPrice.textContent = this.Currency.format( this.weeksRemovedPrice )
        this.els.weeklyAdjustment.textContent = this.Currency.format( 0 )
        this.weeklyPriceAdjustment = false
        this.els.shareOptionDescription.textContent = ``
        this.hide()
    },

    setOriginalWeeklyPrice( price ) {
        this.originalWeeklyPrice = price
    },

    setWeeksAffected( { selectable, skipped } ) {
        this.originalWeeksAffected = selectable - skipped
        this.weeksAffected = this.originalWeeksAffected
        this.els.weeksAffected.textContent = this.weeksAffected
    },

    updateOptionsAdjustment() {
        this.optionsAdjustment = this.weeksAffected * this.weeklyPriceAdjustment
        this.els.optionsAdjustment.textContent = this.Currency.format( this.optionsAdjustment )
        this.els.optionsAdjustment.classList.add( this.optionsAdjustment < 0 ? 'is-negative' : 'is-positive' )
    }

} )
