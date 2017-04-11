module.exports = p => {
    const disabled = p.disabled ? 'disabled': ''
return `` +
`<section class="${p.hide ? 'fd-hidden fd-hide' : ''}">` +
Object.keys( p.states ).map( stateName =>
    `<div data-js="${stateName}" class="state ${stateName} ${stateName === 'start' ? '' : 'fd-hidden fd-hide'}">` +
    p.states[ stateName ].map( button =>
        button.svg
            ? button.svg
            : `<button class="${disabled} ${button.class || ''} "data-js="${button.name}">${button.text}</button>`
    ).join('') +
    `</div>`
).join('') +
`</section>`
}
