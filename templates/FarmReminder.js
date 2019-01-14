module.exports = p => {
    const attachmentMessage = p.hasAttachment ? `<p>Also attached is this week's newsletter. Enjoy!</p>` : ``

return `` +
`<p>Hello!</p>
<p>Please remember to bring back your empty box and pick up your CSA share.</p>
<p>Your delivery location is Patchwork Gardens - ${p.pickupAddress}, ${p.dayofweek} ${p.starttime} to ${p.endtime}.</p>
${attachmentMessage}
${p.customText || ``}`
}