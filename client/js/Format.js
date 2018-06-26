module.exports = {

    Currency: new Intl.NumberFormat( 'en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    } ),

    FillRange( start, end ) {
        return Array( end - start + 1 ).fill().map( (item, index) => start + index )
    },

    GetCoordinateInputs( datum, value ) {
        const longitude = value ? value[0] : '',
            latitude = value ? value[1] : ''

        return `` +
        `<div data-js="${datum.name}" class="form-group">
            <label>${datum.label}</label>
            <div>
                <input type="text" placeholder="Enter longitude" value="${longitude}"/>
                <input type="text" placeholder="Enter latitude" value="${latitude}"/>
            </div>
        </div>`
    },

    GetFormField( datum, value, meta={} ) {
        if( datum.range === 'Geography' ) return this.GetCoordinateInputs( datum, value )

        const icon = datum.metadata
            ? datum.metadata.icon
                ? this.Icons[ datum.metadata.icon ]
                : ``
            : ``
                           
        const options = datum.metadata ? datum.metadata.options : false

        value = ( value === undefined || value === null ) ? '' : value
            
        const label = 
            datum.fk || datum.label
                ? `<label>${datum.fk || datum.label}</label>`
                : ``

        if( options ) {
            if( typeof options === 'function' ) { options(); return this.GetSelect( datum, value, [ ], icon, label ) }
            else if( Array.isArray( options ) ) return this.GetSelect( datum, value, options, icon, label )
        }

        const image = datum.range === 'ImageUrl'
            ? `<div><img src="${this.ImageSrc( value )}" /></div>`
            : ``

        const placeholder = meta.noPlaceholder
            ? ''
            : datum.label || ''

        const input = datum.fk
            ? `<div data-view="typeAhead" data-name="${datum.fk}"></div>`
            : ( datum.range === 'Text' && meta.key === '_id' ) || ( meta.key === 'id' && datum.name === 'description' )
                ? `<textarea data-js="${datum.name}" rows="3">${value}</textarea>`
                : datum.range === 'List' || typeof datum.range === 'object'
                    ? `<div data-js="${datum.name}" data-name="${datum.name}"></div>`
                    : `<input type="${this.RangeToInputType[ datum.range ]}" data-js="${datum.name}" placeholder="${placeholder}" value="${value}" />`

        return `` +
        `<div class="form-group ${image ? `has-image` : ``}">
            ${label}
            ${input}
            ${image}
            ${icon}
        </div>`
    },

    GetFormFields( data, model={}, meta={} ) {
        if( !data ) return ``

        return data
            .filter( datum => meta[ datum.name || datum.fk ] && meta[ datum.name || datum.fk ].hide ? false : true )
            .map( datum => this.GetFormField( datum, model && model[ datum.name ], meta ) ).join('')
    },

    GetIcon( name, opts ) { return Reflect.apply( this.Icons[ name ], this, [ opts ] ) },

    GetListItems( items=[], opts={} ) {
        return items.map( item => {
            const attr = opts.dataAttr ? `data-${opts.dataAttr}="${item[ opts.dataAttr ]}"` : ``
            return `<li ${attr}>${item.label || item}</li>` 
        } ).join('')
    },

    GetSelect( datum, selectedValue, optionsData, icon, label=`` ) {
        if( typeof selectedValue === 'boolean' || typeof selectedValue === 'number' ) selectedValue = selectedValue.toString()

        const options = optionsData.length ? this.GetSelectOptions( optionsData, selectedValue, { valueAttr: 'name' } ) : ``

        return `` +
        `<div class="form-group">
            ${label}
            <select data-js="${datum.name}">
                <option disabled ${!selectedValue ? `selected` : ``} value>${datum.label}</option>
                ${options}
            </select>
            ${icon}
        </div>`
    },

    GetSelectOptions( options=[], selectedValue, opts={ valueAttr: 'value' } ) {
        return options.map( option => `<option ${selectedValue === option[ opts.valueAttr ] ? `selected` : ``} value="${option[ opts.valueAttr ]}">${option.label}</option>` ).join('')
    },

    Icons: require('./.IconMap'),
    
    IconDataJs( p ) { return p.name ? `data-js="${p.name}"` : `` },

    ImageSrc( name ) { return `https://storage.googleapis.com/thoreau-would-be-proud/${name}` },

    ParseTextLinks( text ) {
        let start = text.indexOf('{{'),
            end, rest, target, key, value, replacement

        if( start === -1 ) return text

        rest = text.slice( start )
        target = rest.slice( 0, rest.indexOf('}') + 2 )
        key = target.slice( 2, target.indexOf(':') )
        value = target.slice( target.indexOf(':') + 1, target.indexOf('}') )

        replacement = /email/i.test( target )
            ? `<a href="mailto:${value}" class="link">${key}</a>`
            : /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi.test( value )
                ? `<a target="_blank" href="${value}" class="link">${key}</a>`
                : `<span data-js="link" data-name="${value}" class="link">${key}</span>`

        return this.ParseTextLinks( text.replace( target, replacement ) )
    },

    Range( int ) {
        return Array.from( Array( int ).keys() )
    },

    RangeToInputType: {
        Email: 'email',
        ImageUrl: 'text',
        Password: 'password',
        String: 'text',
        Text: 'text'
    }

}
