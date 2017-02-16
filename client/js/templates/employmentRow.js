module.exports = p =>

p.visible
    ?
    `<div class="row">
        <div class="cell col-xs-8">${p.jobtitle}</div>
        <div class="cell col-xs-4">
            <img data-id="${p.id}" data-js="pdf" src="/static/img/pdf.svg" />
        </div>
    </div>`
    : ``
