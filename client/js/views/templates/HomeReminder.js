const Format = require('../../Format')

module.exports = p => {
    const attachmentMessage = p.hasAttachment ? `<p>Also attached is this week's newsletter. Enjoy!</p>` : ``

return `` +
`<img style="width: 100%;" src="${Format.ImageSrc('header_sunrays_short.png')}" />
<div style="padding: .5rem; color: #fff; background-color: black; text-align: center; font-size: 1.3rem; font-family: 'Raleway';">PATCHWORK GARDENS</div>
<div style="padding: 1rem; color: #222; background-color: #fff5df">
    <p>Hello!</p>
    <p>Please remember to set out your empty box (if you have one). We will be bringing your weekly box of produce and would appreciate the empty box in return.</p>
    ${attachmentMessage}
</div>`
}