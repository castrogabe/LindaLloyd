const express = require('express');
const multer = require('multer');
const { isAuth, isAdmin, transporter } = require('../utils.js');
const emailRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const promotionalEmailTemplate = (
  emailSubject,
  emailMessage,
  items,
  logoCid
) => {
  const itemsHtml = items
    .map(
      (item) => `
      <td style="padding: 10px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); background-color: #fff; text-align: center;">
        <a href="https://linda-22y1.onrender.com" style="text-decoration: none; color: inherit;">
          <img src="cid:${item.cid}" alt="${item.description}" style="max-width: 100%; height: auto; border-radius: 8px;">
          <div style="text-align: center; margin-top: 10px;">
            <p style="font-size: 14px; font-weight: bold; margin: 10px 0;">${item.description}</p>
            <p style="font-size: 16px; font-weight: bold; color: #007bff;">$${item.price}</p>
          </div>
        </a>
      </td>
    `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${emailSubject}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f9f9f9;
        }
        .container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ddd;
          background-color: #fff;
        }
        .header, .footer {
          text-align: center;
          padding: 10px;
          background-color: #fff;
          color: #333;
        }
        .content {
          padding: 20px;
        }
        .items-container {
          width: 100%;
          table-layout: fixed;
          border-collapse: collapse;
        }
        .item-card {
          width: 33.3333%;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="cid:${logoCid}" alt="Company Logo" style="max-width: 150px;">
        </div>
        <div class="content">
          <p>${emailMessage}</p>
          <table class="items-container">
            <tr>
              ${itemsHtml}
            </tr>
          </table>
        </div>
        <div class="footer">
          <p>LINDA LLOYD</p>
          <p>Antiques | Objets d'Art | Interiors</p>
          <p>1276 N Yale Ave</p>
          <p>Claremont, Ca</p>
          <p><a href="mailto:lindalloydantantiques@gmail.com">Email: Linda Lloyd</a></p>
          <p>&copy; ${new Date().getFullYear()} https://linda-22y1.onrender.com. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

emailRouter.post(
  '/mass-email',
  isAuth,
  isAdmin,
  upload.fields([
    { name: 'emailFiles', maxCount: 10 },
    { name: 'logoFile', maxCount: 1 },
  ]),
  async (req, res) => {
    const { emailList, emailSubject, emailMessage, descriptions, prices } =
      req.body;
    console.log('Descriptions:', descriptions); // Debugging
    console.log('Prices:', prices); // Debugging
    const emailFiles = req.files['emailFiles'];
    const logoFile = req.files['logoFile'] ? req.files['logoFile'][0] : null;

    // Ensure descriptions and prices are arrays
    const descriptionsArray = Array.isArray(descriptions)
      ? descriptions
      : [descriptions];
    const pricesArray = Array.isArray(prices) ? prices : [prices];

    const items = emailFiles.map((file, index) => ({
      cid: `item${index}@example.com`,
      description: descriptionsArray[index],
      price: pricesArray[index],
    }));

    const attachments = emailFiles.map((file, index) => ({
      filename: file.originalname,
      content: file.buffer,
      cid: `item${index}@example.com`, // same cid value as in the html img src
    }));

    let logoCid = '';
    if (logoFile) {
      logoCid = 'logo@yourcompany.com';
      attachments.push({
        filename: logoFile.originalname,
        content: logoFile.buffer,
        cid: logoCid,
      });
    }

    const mailOptions = {
      from: process.env.NODE_USER,
      to: emailList.split(','),
      subject: emailSubject,
      html: promotionalEmailTemplate(
        emailSubject,
        emailMessage,
        items,
        logoCid
      ),
      attachments: attachments,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
      res.json({ message: 'Mass email sent successfully' });
    } catch (error) {
      console.error('Error sending mass email:', error);
      res
        .status(500)
        .json({ message: 'Failed to send mass email', error: error.message });
    }
  }
);

module.exports = emailRouter;
