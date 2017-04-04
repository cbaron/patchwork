module.exports = p =>
`<section class="${p.hide ? 'fd-hidden fd-hide' : ''}">` +
Object.keys( p.states ).map( stateName =>
    `<div data-js="${stateName}" class="${stateName === 'start' ? '' : 'fd-hidden fd-hide'}">` +
    p.states[ stateName ].map( button => `<button class="${button.class} "data-js="${button.name}">${button.text}</button>` ).join('') +
    `</div>`
).join('') +
`</section`
