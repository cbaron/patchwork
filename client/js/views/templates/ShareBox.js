module.exports = p => 
`<div class="share-label vcenter">
    <div>${p.label}</div>
    <div>
        <span>${p.humanStartdate}}</span>
        <span>-</span>
        <span>${p.humanEnddate}</span>
    </div>
    <div>{{duration}} weeks</div>
</div>
