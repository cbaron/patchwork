module.exports = p =>
`<div class="farmpickup">
    <span>${p.label}</span>
    <span>-- ${p.farmpickup} --</span>
    <span>${p.dayOfWeek}</span>
    <span>${p.starttime} - ${p.endtime}</span>
</div>`
