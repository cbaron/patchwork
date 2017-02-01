module.exports = p => {
    const list = p.options.map( option => `<li>${option.prompt} for ${option.price} / ${option.unit}</li>` ).join('')
    const paragraphs = p.options.map( option =>`<div class="option"><p>${option.information}</p><img src="/file/shareoption/image/${option.shareOptionId}" /></div>` ).join('')
    return `` +
       `<h2>Add-Ons</h2>
       <div class="intro">In addition to the vegetables, we offer the following Add-On options to your box:</div>
       <ul>${list}</ul>
       <div>${paragraphs}</div>
       <div>Feel free to contact us directly if you have any more questions about the Add-On options.</div>`
}
