const Format = require('../client/js/Format')

module.exports = ({ emailBody }) =>
`<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Patchwork Gardens</title>

        <!--[if gte mso 9]><xml>
          <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml><![endif]-->
    </head>
    <body style="margin:0;padding:0;min-width:100%;background-color:#ffffff;">
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="min-width: 100%;" role="presentation">
            <tbody>
                <tr>
                    <td><img style="width: 100%; display: block;" src="${Format.ImageSrc('header_sunrays_short.png')}" /></td>
                </tr>
                <tr>
                    <td style="padding: .5rem; color: #fff; background-color: black; text-align: center; font-size: 1.3rem; font-family: 'Raleway';">PATCHWORK GARDENS</td>
                </tr>
                <tr>
                    <td style="padding: 1rem; color: #333; background-color: #fff5df; font-size: .8rem;">
                        ${emailBody}
                    </td>
                </tr>
            </tbody>
        </table>
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="min-width: 100%;" role="presentation">
            <tbody>
                <tr style="background-color: black; color: #e7e7e7;">
                    <td style="padding: 1rem; font-size: .95rem; font-weight: bold; text-align: center;">
                        <p style="margin: 0;">Patchwork Gardens<br />9057 W Third St<br />Dayton, OH 45417<br />(937) 835-5807<br />
                            <a style="color: #ffc502; text-decoration: none;" href="mailto:eat@patchworkgardens.net">eat@patchworkgardens.net</a><br />
                            <a style="color: #ffc502; text-decoration: none;" href="https://patchworkgardens.net">https://patchworkgardens.net</a>
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>
    </body>
</html>`