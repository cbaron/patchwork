module.exports = p =>
`<li>
    <span>${p.label}</span>
    <span>-- ${p.address} --</span>
    <span>${p.dayOfWeek}</span>
    <span>${p.starttime} - ${p.endtime}</span>
</li>`
