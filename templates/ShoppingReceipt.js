const Currency = new Intl.NumberFormat( 'en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
} )

module.exports = p =>
`<p>Dear ${p.name},</p>
<p>Thank you for your purchase from the Patchwork Store! Here is a summary for your records:</p>
<table style="border-collapse: collapse; width: 100%; margin: 2rem 0;">
    <tbody>
        <tr><td style="color: #aa0000; font-size: 1rem;">${p.shareLabel}</td></tr>
        <tr><td style="font-size: 1rem; font-weight: bold;">Amount: ${Currency.format(p.total)}</td></tr>
    </tbody>
</table>
<p>If you believe a mistake has been made or have any questions, please contact us by email or phone.</p>
<p style="margin-top: 2rem; font-size: 1.3rem; color: #aa0000;">Thank you!</p>`