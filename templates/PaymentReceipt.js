const Currency = new Intl.NumberFormat( 'en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
} )

module.exports = p =>
`<p>Dear ${p.name},</p>
<p>We are sending you this email to confirm payment for the remaining balance on the following share:</p>
<table style="border-collapse: collapse; width: 100%; margin: 2rem 0;">
    <tbody>
        <tr><td style="color: #aa0000; font-size: 1rem;">${p.shareLabel}</td></tr>
        <tr><td style="font-size: 1rem; font-weight: bold;">Amount: ${Currency.format(p.total)}</td></tr>
    </tbody>
</table>
<p>If you believe a mistake has been made, or have any questions, 
please contact us at <a href="mailto:eat.patchworkgardens@gmail.com">eat.patchworkgardens@gmail.com</a>.</p>
<p style="margin-top: 2rem; font-size: 1.3rem; color: #aa0000;">Thank you!</p>`