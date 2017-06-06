module.exports = Object.assign( {}, require('./__proto__'), {

    Pikaday: require('pikaday'),

    events: {
        exportBtn: 'click',
        viewBtn: 'click'
    },

    handleColumns( rows ) {
        const columns = this.els.columns

        this.removeChildren( columns )

        this.columns = Object.keys( rows[0] )

        this.columns.forEach( column => this.slurpTemplate( { template: `<li>${column}</li>`, insertion: { el: columns } } ) )
    },

    handleRows( rows ) {
        const rowsEl = this.els.rows

        this.removeChildren( rowsEl )

        const template = rows.map( row => {
            const columns = this.columns.map( column => `<li>${row[column]}</li>` ).join('')
            return `<ol>${columns}</ol>`
        } ).join('')

        this.slurpTemplate( { template, insertion: { el: rowsEl } } )
    },

    noResults() {
        this.els.empty.classList.remove('fd-hide')
    },

    onExportBtnClick() {
        const qs = { id: this.els.report.value, to: this.els.to.value, from: this.els.from.value, export: true }
        window.open( `/report?${ window.encodeURIComponent( JSON.stringify( qs ) ) }` )
    },
    
    onViewBtnClick() {
        this.Xhr( { method: 'get', resource: 'report', qs: JSON.stringify( { id: this.els.report.value, to: this.els.to.value, from: this.els.from.value } ) } )
        .then( result => {
            if( result.length == 0 ) return this.noResults()
        
            this.els.empty.classList.add('fd-hide')

            this.handleColumns( result )
            this.handleRows( result )
            return Promise.resolve()
        } )
        .catch( this.Error )
    },

    postRender() {
    
        this.Reports = Object.create( this.Model, { resource: { value: 'report' } } )

        this.Reports.get()
        .then( () => this.Reports.data.forEach( report => this.slurpTemplate( { template: `<option value="${report.id}">${report.label}</option>`, insertion: { el: this.els.report } } ) ) )
        .catch( this.Error )

        new this.Pikaday( { field: this.els.from, format: 'YYYY-MM-DD' } )
        new this.Pikaday( { field: this.els.to, format: 'YYYY-MM-DD' } )

        return this
    },

    removeChildren( el ) {
        while( el.firstChild ) { el.removeChild( el.firstChild ) }
    },
} )
