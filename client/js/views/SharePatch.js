module.exports = Object.assign( {}, require('./__proto__'), {

    Views: {
        buttonFlow() {
            return { 
                model: Object.create( this.Model ).constructor( {
                    states: {
                        start: [ { name: 'save', text: 'Update Share', class:'save-btn', nextState: 'confirm' } ],
                        confirm: [
                            { name: 'confirmBtn', class:'save-btn', text: 'Are You Sure?', emit: true, nextState: 'start' },
                            { name: 'cancel', class:'reset-btn', nextState: 'start', text: 'Cancel' }
                        ]
                    }
                } )
            }
        }
    },

    displayTotal() {
        this.total = 0

        this.total += this.weeksRemovedPrice
        this.total += this.weeksAddedPrice

        if( this.weeklyPriceAdjustment ) this.total += this.optionsAdjustment
        
        this.newGrandTotal = this.originalGrandTotal + this.total

        this.els.originalGrandTotal.textContent = this.Currency.format( this.originalGrandTotal )
        this.els.newGrandTotal.textContent = this.Currency.format( this.newGrandTotal )
        this.els.adjustmentType.textContent = this.total < 0 ? 'Price Reduction:' : 'New Charges:'
        this.els.adjustment.textContent = this.Currency.format( Math.abs( this.total ) )

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
                `Original Weekly Price: ${this.Currency.format(this.originalWeeklyPrice)}`,
                `Weekly price adjustment: ${this.Currency.format(this.weeklyPriceAdjustment)}`,
                `New Weekly Price: ${this.Currency.format(this.originalWeeklyPrice + this.weeklyPriceAdjustment)}`,
                `Weeks affected: ${this.weeksAffected}`
            ].join('\n')
    },

    getPatchData() {
        return {
            value: this.total,
            options: {
                changes: this.optionChanges || [],
                originalWeeklyPrice: this.originalWeeklyPrice,
                weeklyPriceAdjustment: this.weeklyPriceAdjustment,
                newWeeklyPrice: this.originalWeeklyPrice + this.weeklyPriceAdjustment,
                weeksAffected: this.weeksAffected
            },
            description: this.getDescription(),
            sendEmail: this.els.sendEmail.checked,
            weeks: {
                addedDates: this.weeksAdded,
                addedPrice: this.weeksAddedPrice,
                removedDates: this.weeksRemoved,
                removedPrice: this.weeksRemovedPrice
            }
        }
    },

    onOptionsReset() {
        this.weeklyPriceAdjustment = false
        this.els.options.classList.add('fd-hidden')

        this.els.weeklyAdjustment.textContent = this.Currency.format( 0 )
        this.els.shareOptionDescription.innerHTML = ''

        this.displayTotal()

        if( this.els.weeksRemoved.textContent == 0 && this.els.weeksAdded.textContent == 0 ) this.els.container.classList.add('fd-hidden')
    },

    onWeeksReset() {
        this.onWeekUpdate( { addedDates: [], removedDates: [] } )
    },

    onOptionsUpdate( { description, priceAdjustment } ) {
        this.optionsDescription = description.textDescription
        this.optionChanges = description.optionChanges

        this.els.options.classList.remove('fd-hidden')

        this.weeklyPriceAdjustment = priceAdjustment
        this.els.weeklyAdjustment.textContent = this.Currency.format( priceAdjustment )
        this.els.shareOptionDescription.innerHTML = ''

        this.slurpTemplate( {
            insertion: { el: this.els.shareOptionDescription },
            template: description.textDescription.split('\n\t').map( option => `<li>${option}</li>` ).join('')
        } )

        this.els.originalWeeklyPrice.textContent = this.Currency.format( this.originalWeeklyPrice )
        this.els.newWeeklyPrice.textContent = this.Currency.format( this.originalWeeklyPrice + priceAdjustment )
        
        this.updateOptionsAdjustment()

        this.displayTotal().show()
    },

    onWeekUpdate( { addedDates, removedDates } ) {
        const added = addedDates.length
        const removed = removedDates.length

        this.weeksAdded = addedDates
        this.weeksRemoved = removedDates

        this.weeksAffected = this.originalWeeksAffected - removed
        this.els.weeksAffected.textContent = this.weeksAffected
        
        this.els.weeksRemoved.textContent = removed
        this.els.weeksAdded.textContent = added

        this.weeksAddedPrice = added * ( this.originalWeeklyPrice + ( this.weeklyPriceAdjustment || 0 ) )
        this.els.weeksAddedPrice.textContent = this.Currency.format( this.weeksAddedPrice )

        this.weeksRemovedPrice = -1 * removed * this.originalWeeklyPrice
        this.els.weeksRemovedPrice.textContent = this.Currency.format( this.weeksRemovedPrice )

        if( added === 0 && removed === 0 && !this.weeklyPriceAdjustment ) return this.els.container.classList.add('fd-hidden')
        
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
        this.els.sendEmail.checked = false
        this.optionsDescription = ``
        this.weeksAdded = []
        this.weeksRemoved = []
        this.els.weeksAdded.textContent = 0
        this.els.weeksRemoved.textContent = 0
        this.weeksRemovedPrice = 0
        this.els.weeksRemovedPrice.textContent = this.Currency.format( this.weeksRemovedPrice )
        this.els.weeklyAdjustment.textContent = this.Currency.format( 0 )
        this.weeklyPriceAdjustment = false
        this.els.shareOptionDescription.innerHTML = ''
        this.hide()
    },

    setOriginalWeeklyPrice( price, weeks ) {
        this.originalWeeklyPrice = price
        this.originalGrandTotal = price * weeks
    },

    setWeeksAffected( { selectable, skipped } ) {
        this.originalWeeksAffected = selectable - skipped
        this.weeksAffected = this.originalWeeksAffected
        this.els.weeksAffected.textContent = this.weeksAffected
    },

    templateOpts() { return { isAdmin: window.location.pathname.split('/').includes('admin-plus') } },

    updateOptionsAdjustment() {
        this.optionsAdjustment = this.weeksAffected * this.weeklyPriceAdjustment
        this.els.optionsAdjustment.textContent = this.Currency.format( this.optionsAdjustment )
    }

} )
