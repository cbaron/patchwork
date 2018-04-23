module.exports = p => 
`<li data-date="${p.date.format('YYYYMMDD')}" class="delivery-date ${p.isAdmin ? '' : 'not-admin'} ${p.selected ? 'selected' : ''} ${p.unselectable ? 'unselectable' : ''}">
    <div>${p.date.format('ddd')}</div>
    <div>${p.date.format('MMM')}</div>
    <div>${p.date.format('D')}</div>
</div>`
