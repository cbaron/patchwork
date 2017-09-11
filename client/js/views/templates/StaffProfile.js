module.exports = p =>
`<div class="bio">
    <div>
        <img data-src="https://storage.googleapis.com/double-quill-3243/${p.tableName}-${p.id}" alt="Staff photo" />
        <div class="overlay">
            <div>${p.profile || ''}</div>
        </div>
    </div>
    <div>${p.name}</div>
</div>`