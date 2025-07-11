const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        slug: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        salePrice: { type: Number, default: null },
        shippingCharge: { type: Number, default: null },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      states: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    shippingInvoiceUrl: { type: String },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    appliedTaxRate: { type: Number }, // ← Add here
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    orderName: { type: String },

    // ✅ NEW FIELD
    squareOrderId: { type: String }, // Optional but useful for traceability
    shippingInvoicePaid: { type: Boolean, default: false },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isShipped: { type: Boolean, default: false },
    shippingInvoiceSent: { type: Boolean, default: false },
    shippingPaidAt: { type: Date },
    shippedAt: { type: Date },
    deliveryDays: { type: String },
    carrierName: { type: String },
    trackingNumber: { type: String },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
