module.exports = p =>
`<p>Dear ${p.name},</p>
<p>Thank you for your Patchwork Gardens CSA purchase! In order for you to log in to the site, we will need to verify your email.</p>
<p>Please click <a style="color: #aa0000; text-decoration: underline;" href="${p.url}/verify/${p.token}">HERE</a> to do so.</p>`