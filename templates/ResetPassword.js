module.exports = p =>
`<p>Dear ${p.name},</p>
<p>Please click <a href="${p.url}/resetPassword/${p.token}">HERE</a> to reset your Patchwork Gardens password.</div>`