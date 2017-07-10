module.exports = p =>
`<div class="bio clearfix">           
    <img data-src="https://storage.googleapis.com/double-quill-3243/${p.tableName}-${p.id}" alt="Staff photo">
    <div class="inner">
        <h3>${p.name}</h3>
        <div>${p.profile || ''}</div>
    </div>
</div>
<hr>`