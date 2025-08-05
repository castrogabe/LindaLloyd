import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from './models/userModel.js';

const getImageUrl = (imgPath) => {
  return imgPath.startsWith('http')
    ? imgPath
    : baseUrl() + (imgPath.startsWith('/') ? imgPath : '/' + imgPath);
};

// Function to calculate the total quantity of items in a filtered list
const calculateFilteredTotalQuantity = (items) => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

const baseUrl = () =>
  process.env.BASE_URL
    ? process.env.BASE_URL
    : process.env.NODE_ENV !== 'production'
    ? 'http://localhost:3000'
    : 'https:lloyd-tme8.onrender.com';

const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// Helper function to convert BigInt to string for JSON serialization
function bigIntReplacer(key, value) {
  if (typeof value === 'bigint') {
    return value.toString(); // Convert BigInt to string for JSON serialization
  }
  return value;
}

const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7);
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Admin Token' });
  }
};

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  port: 587,
  secure: false,
  auth: {
    user: process.env.NODE_USER,
    pass: process.env.NODE_PASSWORD,
  },
});

// send Admin SMS message
const sendAdminSMS = async ({ subject, message, customerName, orderName }) => {
  try {
    const admins = await User.find({
      isAdmin: true,
      phone: { $ne: null },
      carrier: { $ne: null },
    });
    const smsRecipients = admins.map(
      (admin) => `${admin.phone}@${admin.carrier}`
    );

    const alertSubject = subject || 'New Order Placed';
    const formattedMessage =
      `${alertSubject}\n` +
      (orderName ? `Order: ${orderName}\n` : '') +
      (customerName ? `From: ${customerName}\n` : '') +
      (message || '');

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: smsRecipients,
      subject: '',
      text: formattedMessage.trim(),
    };

    await transporter.sendMail(mailOptions);
    // console.log('Admin SMS alert sent to:', smsRecipients);
  } catch (err) {
    console.error('Failed to send admin SMS:', err);
  }
};

// Send email receipt (for initial purchase)
const payOrderEmailTemplate = (order) => {
  const totalQuantity = calculateFilteredTotalQuantity(order.orderItems);
  const formattedDate = `${(order.createdAt.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${order.createdAt
    .getDate()
    .toString()
    .padStart(2, '0')}-${order.createdAt.getFullYear()}`;

  return `<h1>Thanks for shopping with lindalloyd.com, we will send a confirmation when your order ships</h1>
    <p>
    Hi ${order.user.name},</p>
    <p>We are processing your order.</p>
    <p>Please email me at sweetwatertc@yahoo.com if you have any questions.</p>
    <h2>Purchase Order ${order._id} (${formattedDate})</h2>
    <table>
      <thead>
        <tr>
          <td><strong align="right">Item's and Price</strong></td>
        </tr>
      </thead>
      <tbody>
        ${order.orderItems
          .map(
            (item) => `
              <tr>
              <td><img src="${getImageUrl(item.image)}" alt="${
              item.name
            }" width="50" height="50" />
            </td>
                <td>${item.name}</td>
                <td align="center">Qty: ${item.quantity}</td>
                <td align="right"> $${item.price.toFixed(2)}</td>
              </tr>`
          )
          .join('\n')}
      </tbody>
      <tfoot>
        <tr><td colspan="2">Total Quantity:</td><td align="right">${totalQuantity}</td></tr>
        <tr><td colspan="2">Items Price:</td><td align="right">$${order.itemsPrice.toFixed(
          2
        )}</td></tr>
        <tr><td colspan="2">Tax Price:</td><td align="right">$${order.taxPrice.toFixed(
          2
        )}</td></tr>
        <tr><td colspan="2">Shipping Price:</td><td align="right">$${order.shippingPrice.toFixed(
          2
        )}</td></tr>
        <tr><td colspan="2"><strong>Total Price:</strong></td><td align="right"><strong>$${order.totalPrice.toFixed(
          2
        )}</strong></td></tr>
        <tr><td colspan="2">Payment Method:</td><td align="right">${
          order.paymentMethod
        }</td></tr>
      </tfoot>
    </table>
    <h2>Shipping address</h2>
    <p>
      ${order.shippingAddress.fullName},<br/>
      ${order.shippingAddress.address},<br/>
      ${order.shippingAddress.city},<br/>
      ${order.shippingAddress.country},<br/>
      ${order.shippingAddress.postalCode}<br/>
    </p>
    <hr/>
    <p>Thanks for shopping with us.</p>`;
};

// ************************* send confirmation email *************************

// Original general shipping template (might still be used for legacy or specific cases)
const shipOrderEmailTemplate = (order) => {
  const totalQuantity = calculateFilteredTotalQuantity(order.orderItems);
  const formattedDate = `${(order.createdAt.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${order.createdAt
    .getDate()
    .toString()
    .padStart(2, '0')}-${order.createdAt.getFullYear()}`;

  let shippingDetailsToUse = null;

  if (order.flatRateShippingDetails?.isShipped) {
    shippingDetailsToUse = order.flatRateShippingDetails;
  } else if (order.invoiceShippingDetails?.isShipped) {
    shippingDetailsToUse = order.invoiceShippingDetails;
  }

  const deliveryDays = shippingDetailsToUse?.deliveryDays || 'N/A';
  const carrierName = shippingDetailsToUse?.carrierName || 'N/A';
  const trackingNumber = shippingDetailsToUse?.trackingNumber || 'N/A';

  return `<h1>Your order is on the way!</h1>
    <p>Hi ${order.user.name}, thanks for shopping with lindalloyd.com</p>
    <p>Great News, your order has been shipped, and will arrive within <strong>${deliveryDays}</strong> days.</p>
    <p>Your package shipped <strong>${carrierName}.</strong></p>
    <p>Your tracking number is: <strong>${trackingNumber}</strong></p>
    <p>Please email me at sweetwatertc@yahoo.com if you have any questions.</p>
    <h2>Shipped Order ${order._id} (${formattedDate})</h2>
    <table>
      <thead>
        <tr><td><strong align="right">Item's and Price</strong></td></tr>
      </thead>
      <tbody>
        ${order.orderItems // This will still show ALL items if this template is used
          .map(
            (item) => `
            <td><img src="${getImageUrl(item.image)}" alt="${
              item.name
            }" width="50" height="50" />
            </td>
                <td>${item.name}</td>
                <td align="center">Qty: ${item.quantity}</td>
                <td align="right"> $${item.price.toFixed(2)}</td>
              </tr>`
          )
          .join('\n')}
      </tbody>
      <tfoot>
        <tr><td colspan="2">Total Quantity:</td><td align="right">${totalQuantity}</td></tr>
        <tr><td colspan="2">Items Price:</td><td align="right">$${order.itemsPrice.toFixed(
          2
        )}</td></tr>
        <tr><td colspan="2">Tax Price:</td><td align="right">$${order.taxPrice.toFixed(
          2
        )}</td></tr>
        <tr><td colspan="2">Shipping Price:</td><td align="right">$${order.shippingPrice.toFixed(
          2
        )}</td></tr>
        <tr><td colspan="2"><strong>Total Price:</strong></td><td align="right"><strong>$${order.totalPrice.toFixed(
          2
        )}</strong></td></tr>
        <tr><td colspan="2">Payment Method:</td><td align="right">${
          order.paymentMethod
        }</td></tr>
      </tfoot>
    </table>
    <h2>Shipping address</h2>
    <p>
      ${order.shippingAddress.fullName},<br/>
      ${order.shippingAddress.address},<br/>
      ${order.shippingAddress.city},<br/>
      ${order.shippingAddress.country},<br/>
      ${order.shippingAddress.postalCode}<br/>
    </p>
    <hr/>
    <p>Thanks for shopping with us.</p>`;
};

// NEW: HTML template for separate shipping invoice email (sent on invoice creation)
const shippingInvoiceEmailTemplate = (order, squareShippingInvoiceUrl) => {
  // This template should only show items that *require* a shipping invoice
  const filteredItems = order.orderItems.filter(
    (item) => item.requiresShippingInvoice
  );
  const totalQuantity = calculateFilteredTotalQuantity(filteredItems);

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
    <p>Hello ${order.user.name},</p>
    <h2>Purchase Order ${order._id} (${formattedDate})</h2>
    <p>Thank you for your purchase. This invoice is for the **shipping cost only**. Your items and tax were paid at checkout.</p>
    <h3>Paid at Checkout</h3>
    <p><strong>Items Total:</strong> $${order.itemsPrice.toFixed(2)} (Paid)</p>
    <p><strong>Tax:</strong> $${order.taxPrice.toFixed(2)} (Paid)</p>
    <h3>Shipping Invoice</h3>
    <p><strong>Shipping Charge:</strong> $${order.shippingPrice.toFixed(2)}</p>
    <p><a href="${squareShippingInvoiceUrl}" style="font-size:16px;color:#3366cc;text-decoration:none;padding:10px 20px;border-radius:5px;background-color:#f0f0f0;border:1px solid #ccc;">Pay Shipping Charge</a></p>
    <h3>Items in This Order</h3>
    <table cellpadding="5" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;">
      <thead>
        <tr style="background-color:#f8f8f8;">
          <th align="left" style="padding: 8px; border: 1px solid #ddd;">Image</th>
          <th align="left" style="padding: 8px; border: 1px solid #ddd;">Name</th>
          <th align="center" style="padding: 8px; border: 1px solid #ddd;">Quantity</th>
          <th align="right" style="padding: 8px; border: 1px solid #ddd;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${filteredItems // <<< CRITICAL FIX: Use filteredItems here
          .map(
            (item) => `
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><img src="${getImageUrl(
                item.image
              )}" alt="${
              item.name
            }" width="50" height="50" style="border-radius: 4px;" /></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${
                item.name
              }</td>
              <td align="center" style="padding: 8px; border: 1px solid #ddd;">${
                item.quantity
              }</td>
              <td align="right" style="padding: 8px; border: 1px solid #ddd;">$${item.price.toFixed(
                2
              )}</td>
            </tr>`
          )
          .join('\n')}
      </tbody>
    </table>
    <p>Please email me at sweetwatertc@yahoo.com if you have any questions.</p>
  `;
};

// --- NEW: Template for Invoice Items Shipping Confirmation ---
const invoiceItemsShipConfirmationEmailTemplate = (order, shippingDetails) => {
  const filteredItems = order.orderItems.filter(
    (item) => item.requiresShippingInvoice
  );
  const totalQuantity = calculateFilteredTotalQuantity(filteredItems);
  const formattedDate = `${(order.createdAt.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${order.createdAt
    .getDate()
    .toString()
    .padStart(2, '0')}-${order.createdAt.getFullYear()}`;

  const deliveryDays = shippingDetails?.deliveryDays || 'N/A';
  const carrierName = shippingDetails?.carrierName || 'N/A';
  const trackingNumber = shippingDetails?.trackingNumber || 'N/A';

  return `<h1>Your invoiced items are on the way!</h1>
    <p>Hi ${order.user.name},</p>
    <p>Great News! The items requiring a separate shipping invoice from your order have been shipped.</p>
    <p>They will arrive within <strong>${deliveryDays}</strong> days.</p>
    <p>Your package shipped <strong>${carrierName}.</strong></p>
    <p>Your tracking number is: <strong>${trackingNumber}</strong></p>
    <p>Please email me at sweetwatertc@yahoo.com if you have any questions.</p>
    <h2>Shipped Invoiced Items for Order ${order._id} (${formattedDate})</h2>
    <table>
      <thead>
        <tr><td><strong align="right">Item's and Price</strong></td></tr>
      </thead>
      <tbody>
        ${filteredItems // <<< CRITICAL FIX: Use filteredItems here
          .map(
            (item) => `
            <tr>
              <td><img src="${getImageUrl(item.image)}" alt="${
              item.name
            }" width="50" height="50" /></td>
              <td>${item.name}</td>
              <td align="center">Qty: ${item.quantity}</td>
              <td align="right"> $${item.price.toFixed(2)}</td>
            </tr>`
          )
          .join('\n')}
      </tbody>
      <tfoot>
        <tr><td colspan="2">Total Quantity:</td><td align="right">${totalQuantity}</td></tr>
        <tr><td colspan="2">Items Price:</td><td align="right">$${order.itemsPrice.toFixed(
          2
        )}</td></tr>
        <tr><td colspan="2">Tax Price:</td><td align="right">$${order.taxPrice.toFixed(
          2
        )}</td></tr>
        <tr><td colspan="2">Shipping Price:</td><td align="right">$${order.shippingPrice.toFixed(
          2
        )}</td></tr>
        <tr><td colspan="2"><strong>Total Price:</strong></td><td align="right"><strong>$${order.totalPrice.toFixed(
          2
        )}</strong></td></tr>
        <tr><td colspan="2">Payment Method:</td><td align="right">${
          order.paymentMethod
        }</td></tr>
      </tfoot>
    </table>
    <h2>Shipping address</h2>
    <p>
      ${order.shippingAddress.fullName},<br/>
      ${order.shippingAddress.address},<br/>
      ${order.shippingAddress.city},<br/>
      ${order.shippingAddress.country},<br/>
      ${order.shippingAddress.postalCode}<br/>
    </p>
    <hr/>
    <p>Thanks for shopping with us.</p>`;
};

// --- NEW: Template for Flat Rate Items Shipping Confirmation ---
const flatRateItemsShipConfirmationEmailTemplate = (order, shippingDetails) => {
  const filteredItems = order.orderItems.filter(
    (item) =>
      item.useFlatRateShipping ||
      (item.shippingCharge > 0 && !item.requiresShippingInvoice)
  );
  const totalQuantity = calculateFilteredTotalQuantity(filteredItems);
  const formattedDate = `${(order.createdAt.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${order.createdAt
    .getDate()
    .toString()
    .padStart(2, '0')}-${order.createdAt.getFullYear()}`;

  const deliveryDays = shippingDetails?.deliveryDays || 'N/A';
  const carrierName = shippingDetails?.carrierName || 'N/A';
  const trackingNumber = shippingDetails?.trackingNumber || 'N/A';

  return `<h1>Your flat-rate items are on the way!</h1>
    <p>Hi ${order.user.name},</p>
    <p>Great News! The flat-rate/included items from your order have been shipped.</p>
    <p>They will arrive within <strong>${deliveryDays}</strong> days.</p>
    <p>Your package shipped <strong>${carrierName}.</strong></p>
    <p>Your tracking number is: <strong>${trackingNumber}</strong></p>
    <p>Please email me at sweetwatertc@yahoo.com if you have any questions.</p>
    <h2>Shipped Flat-Rate Items for Order ${order._id} (${formattedDate})</h2>
    <table>
      <thead>
        <tr><td><strong align="right">Item's and Price</strong></td></tr>
      </thead>
      <tbody>
        ${filteredItems // <<< CRITICAL FIX: Use filteredItems here
          .map(
            (item) => `
            <tr>
              <td><img src="${getImageUrl(item.image)}" alt="${
              item.name
            }" width="50" height="50" /></td>
              <td>${item.name}</td>
              <td align="center">Qty: ${item.quantity}</td>
              <td align="right"> $${item.price.toFixed(2)}</td>
            </tr>`
          )
          .join('\n')}
      </tbody>
      <tfoot>
        <tr><td colspan="2">Total Quantity:</td><td align="right">${totalQuantity}</td></tr>
        <tr><td colspan="2">Items Price:</td><td align="right">$${order.itemsPrice.toFixed(
          2
        )}</td></tr>
        <tr><td colspan="2">Tax Price:</td><td align="right">$${order.taxPrice.toFixed(
          2
        )}</td></tr>
        <tr><td colspan="2">Shipping Price:</td><td align="right">$${order.shippingPrice.toFixed(
          2
        )}</td></tr>
        <tr><td colspan="2"><strong>Total Price:</strong></td><td align="right"><strong>$${order.totalPrice.toFixed(
          2
        )}</strong></td></tr>
        <tr><td colspan="2">Payment Method:</td><td align="right">${
          order.paymentMethod
        }</td></tr>
      </tfoot>
    </table>
    <h2>Shipping address</h2>
    <p>
      ${order.shippingAddress.fullName},<br/>
      ${order.shippingAddress.address},<br/>
      ${order.shippingAddress.city},<br/>
      ${order.shippingAddress.country},<br/>
      ${order.shippingAddress.postalCode}<br/>
    </p>
    <hr/>
    <p>Thanks for shopping with us.</p>`;
};

// --- MODIFIED: sendShippingConfirmationEmail to accept shippingType ---
const sendShippingConfirmationEmail = async (req, order, shippingType) => {
  try {
    console.log(
      '📤 Attempting to send shipping email for order:',
      order._id,
      'Type:',
      shippingType
    );
    const customerEmail = order.user.email;
    console.log('📧 Email address:', customerEmail);

    if (!customerEmail) {
      console.error('❌ No customer email found for order:', order._id);
      return;
    }

    let htmlContent;
    let subjectPrefix;
    let shippingDetailsForTemplate; // This variable is not strictly needed here as it's passed directly to template

    if (shippingType === 'invoice') {
      htmlContent = invoiceItemsShipConfirmationEmailTemplate(
        order,
        order.invoiceShippingDetails
      );
      subjectPrefix = 'Invoiced Items Shipped';
    } else if (shippingType === 'flatRate') {
      htmlContent = flatRateItemsShipConfirmationEmailTemplate(
        order,
        order.flatRateShippingDetails
      );
      subjectPrefix = 'Flat-Rate Items Shipped';
    } else {
      // Fallback for general 'shipped' if still used, or an error
      console.warn(
        '⚠️ Unknown shippingType or no specific type provided. Using general template.'
      );
      htmlContent = shipOrderEmailTemplate(order); // The old general template
      subjectPrefix = 'Order Shipped';
    }

    const emailContent = {
      from: 'lindalloydantiques@gmail.com',
      to: customerEmail,
      subject: `${subjectPrefix} from lindalloyd.com`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(emailContent);
    // console.log(
    //   `✅ Shipping email sent to ${customerEmail} (${shippingType}), Message ID: ${info.messageId}`
    // );
  } catch (error) {
    console.error('❌ Failed to send shipping confirmation email:', error);
    if (error.response) {
      console.error('Nodemailer Error Response:', error.response);
    }
    if (error.responseCode) {
      console.error('Nodemailer Error Code:', error.responseCode);
    }
  }
};

export {
  baseUrl,
  generateToken,
  getImageUrl,
  isAuth,
  isAdmin,
  transporter,
  sendAdminSMS,
  payOrderEmailTemplate,
  shipOrderEmailTemplate,
  sendShippingConfirmationEmail,
  bigIntReplacer,
  shippingInvoiceEmailTemplate,
  invoiceItemsShipConfirmationEmailTemplate,
  flatRateItemsShipConfirmationEmailTemplate,
};
