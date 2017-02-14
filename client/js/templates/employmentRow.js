module.exports = p =>

p.visible
    ?
    `<div class="row">
        <div class="cell col-xs-8">${p.jobtitle}</div>
        <div class="cell col-xs-4">
            <a href="/file/employment/jobdescription/${p.id}"><img src="/static/img/pdf.svg" /></a>
        </div>
    </div>`
    : ``