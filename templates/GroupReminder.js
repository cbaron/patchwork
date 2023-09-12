module.exports = p => {
    const attachmentMessage = p.hasAttachment ? `<p>Also attached is this month's newsletter. Enjoy!</p>` : ``

return `` +
`<p>Hello!</p>
<p>Please remember to bring back your empty box (if you have one) and pick up your CSA share.</p>
<p>Your delivery location is ${p.dropoffName} - ${p.street}, ${p.dayofweek} ${p.starttime} to ${p.endtime}.</p>
${attachmentMessage}
${p.customText || ``}`
}