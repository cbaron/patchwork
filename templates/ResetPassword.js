module.exports = p =>
`<p>Dear ${p.name},</p>
<p>Please click <a style="color: #aa0000; text-decoration: underline;" href="${p.url}/resetPassword/${p.token}">HERE</a> to reset your Patchwork Gardens password.</div>`