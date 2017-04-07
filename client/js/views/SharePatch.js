module.exports = Object.assign( {}, require('./__proto__'), {

    displayTotal() {
        let total = 0

        total -= parseInt( this.els.weeksRemoved.textContent ) * this.originalWeeklyPrice
        
        if( this.weeklyPriceAdjustment ) {
            total += parseInt( this.els.weeksAffected.textContent ) * this.weeklyPriceAdjustment
        } else {
            total += parseInt( this.els.weeksAdded.textContent ) * this.originalWeeklyPrice
        }
        
        this.els.adjustment.textContent = this.Currency.format( total )

        return this
    },

    onOptionsReset( { description, originalWeeklyPrice, priceAdjustment } ) {
        this.weeklyPriceAdjustment = false
        this.els.options.classList.add('fd-hidden')

        if( this.els.weeksRemoved == 0 && this.els.weeksAdded == 0 ) this.els.container.classList.add('fd-hidden')
    },

    onOptionsUpdate( { description, priceAdjustment } ) {
        console.log( description )

        this.weeklyPriceAdjustment = priceAdjustment
        this.els.shareOptionDescription.textContent = description
        
        this.els.newWeeklyPrice.textContent = this.Currency.format( this.originalWeeklyPrice + priceAdjustment )

        this.displayTotal().show()
    },

    postRender() {
        this.els.weeksAdded.textContent = 0
        this.els.weeksRemoved.textContent = 0
        this.els.weeksRemovedPrice.textContent = this.Currency.format( 0 )

        return this
    },

    setOriginalWeeklyPrice( price ) {
        this.originalWeeklyPrice = price
        this.els.originalWeeklyPrice.textContent = this.Currency.format( price )
    },

    setWeeksAffected( i ) {
        this.els.weeksAffected.textContent = i
    }

} )
