module.exports = Object.assign( {}, require('./__proto__'), {

    Pikaday: require('pikaday'),

    events: {
        dateTypeSelect: 'change',
        exportBtn: 'click',
        viewBtn: 'click'
    },

    clearTable() {
        this.removeChildren( this.els.columns )
        this.removeChildren( this.els.rows )
    },

    getDateQueries() {
        if( this.dateType === 'season' ) {
            const share = this.Shares.data.find( datum => datum.name === this.els.season.value )
            return { shareId: share.id, shareName: share.name }
        } else if( this.dateType === 'year' ) {
            return { year: this.els.year.value }
        }

        return { from: this.els.from.value, to: this.els.to.value }
    },

    getReportOptions() {
        this.Reports.data.forEach( report =>
            this.slurpTemplate( {
                template: `<option value="${report.id}">${report.label}</option>`,
                insertion: { el: this.els.report }
            } )
        )
    },

    getSeasonOptions() {
        this.Shares.data.forEach( share =>
            this.slurpTemplate( {
                template: `<option value="${share.name}">${share.label}</option>`,
                insertion: { el: this.els.season }
            } )
        )
    },

    getYearOptions() {
        const currentYear = new Date().getFullYear(),
            range = this.Format.FillRange( currentYear - 10, currentYear ).reverse()

        range.forEach( year =>
            this.slurpTemplate( {
                template: `<option value="${year}">${year}</option>`,
                insertion: { el: this.els.year }
            } )
        )
    },

    handleColumns( rows ) {
        const columns = this.els.columns

        this.columns = Object.keys( rows[0] )

        this.columns.forEach( column => this.slurpTemplate( { template: `<li>${column}</li>`, insertion: { el: columns } } ) )
    },

    handleRows( rows ) {
        const rowsEl = this.els.rows

        const template = rows.map( row => {
            const columns = this.columns.map( column => `<li>${row[column] || ''}</li>` ).join('')
            return `<ol>${columns}</ol>`
        } ).join('')

        this.slurpTemplate( { template, insertion: { el: rowsEl } } )
    },

    noResults() {
        this.els.empty.classList.remove('fd-hidden')
    },

    onDateTypeSelectChange( e ) {
        this.dateType = e.target.value
        this.toggleDateTypes( e.target.value )
    },

    onExportBtnClick() {
        const qs = Object.assign( this.getDateQueries(), { id: this.els.report.value, export: true } )
        window.open( `/report?${ window.encodeURIComponent( JSON.stringify( qs ) ) }` )
    },
    
    onViewBtnClick() {
        this.Xhr( { method: 'get', resource: 'report', qs: JSON.stringify( Object.assign( this.getDateQueries(), { id: this.els.report.value } ) ) } )
        .then( result => {
            this.clearTable()

            if( result.length == 0 ) return this.noResults()
        
            this.els.empty.classList.add('fd-hidden')

            this.handleColumns( result )
            this.handleRows( result )
            return Promise.resolve()
        } )
        .catch( this.Error )
    },

    postRender() {
        this.Reports = Object.create( this.Model, { resource: { value: 'report' } } )
        this.Shares = Object.create( this.Model, { resource: { value: 'share' } } )

        Promise.all( [ this.Reports.get(), this.Shares.get() ] )
        .then( () => {
            this.getReportOptions()
            this.getSeasonOptions()
            this.getYearOptions()
        } )
        .catch( this.Error )

        new this.Pikaday( { field: this.els.from, format: 'YYYY-MM-DD' } )
        new this.Pikaday( { field: this.els.to, format: 'YYYY-MM-DD' } )

        return this
    },

    removeChildren( el ) {
        while( el.firstChild ) { el.removeChild( el.firstChild ) }
    },

    toggleDateTypes( type ) {
        this.els.custom.classList.toggle( 'fd-hidden', type !== 'custom' )
        this.els.season.parentNode.classList.toggle( 'fd-hidden', type !== 'season' )
        this.els.year.parentNode.classList.toggle( 'fd-hidden', type !== 'year' )
    }
} )
