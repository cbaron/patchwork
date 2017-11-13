const getHeading = ( p = { opts:{} } ) => {
    if( !p.opts || !p.opts.name ) return ``
    return p.opts.toggle
        ? `<div data-js="toggle" class="heading side-by-side toggle">
            ${p.GetIcon('caret-down')}
            <span>${p.opts.name}</span>
          </div>`
        : `<h3 class="heading">${p.opts.name}</h3>`
}

module.exports = function( p ) {
    const buttonClass = p.model.isDocumentList ? 'floating' : 'btn-yellow'

return `` +
`<section>
    ${getHeading(p)}
    <ol data-js="list" class="list ${p.model.draggable || p.model.droppable ? 'no-select' : '' }"></ol>
    <div class="button-row">
        ${p.model.reset ? `<button class="${buttonClass}" data-js="resetBtn" type="button">Reset</button>` : ``}
        ${p.model.save ? `<button class="${buttonClass}" data-js="saveBtn" type="button">Save</button>` : ``}
        ${p.model.add ? `<button class="${buttonClass}" data-js="addBtn" type="button">Add</button>` : ``}
    </div>
</section>`
}
