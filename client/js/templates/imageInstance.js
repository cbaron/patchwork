module.exports = p => {
    const caption = p.caption ? [ `<figure>`, `<figcaption>${p.caption}</figcaption></figure>` ] : [ ``, `` ];

    return `${caption[0]}<img src="/file/${p.tableName}/image/${p.id}" alt="">${caption[1]}`
}
