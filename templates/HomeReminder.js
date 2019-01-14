module.exports = p => {
    const attachmentMessage = p.hasAttachment ? `<p>Also attached is this week's newsletter. Enjoy!</p>` : ``

return `` +
`<p>Hello!</p>
<p>Please remember to set out your empty box (if you have one). We will be bringing your weekly box of produce and would appreciate the empty box in return.</p>
${attachmentMessage}
${p.customText || ``}`
}