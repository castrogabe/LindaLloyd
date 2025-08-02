import mongoose from 'mongoose';

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
        useFlatRateShipping: { type: Boolean, default: false },
        requiresShippingInvoice: { type: Boolean, default: false },
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
      county: { type: String, required: true }, // ✅ NEW FIELD
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
    shippingPrice: { type: Number, required: true, default: 0 }, // This is the sum of all shipping components
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    appliedTaxRate: { type: Number },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    orderName: { type: String },
    squareOrderId: { type: String },
    separateShippingRequired: { type: Boolean, default: false }, // Keep this if it's a flag for general separate handling

    // For the shipping invoice specific to certain items
    shippingInvoiceUrl: { type: String },
    shippingInvoiceId: { type: String },
    shippingInvoicePaid: { type: Boolean, default: false },
    shippingInvoiceSent: { type: Boolean, default: false },
    shippingPaidAt: { type: Date },
    separateShippingPrice: { type: Number, default: 0 }, // This is the amount for the separate invoice

    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },

    // --- NEW: Separate Shipping Status and Details by Method ---
    // Instead of a single isShipped, we track groups.

    // 1. Details for items that require a separate shipping invoice
    invoiceShippingDetails: {
      isShipped: { type: Boolean, default: false },
      shippedAt: { type: Date },
      deliveryDays: { type: String },
      carrierName: { type: String },
      trackingNumber: { type: String },
      // You could also store an array of item IDs that fall into this group for clarity,
      // though typically you'd infer this from `orderItems` where `requiresShippingInvoice: true`.
      // itemIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    },

    // 2. Details for items with flat rate or free shipping (included in initial payment)
    flatRateShippingDetails: {
      isShipped: { type: Boolean, default: false },
      shippedAt: { type: Date },
      deliveryDays: { type: String },
      carrierName: { type: String },
      trackingNumber: { type: String },
      // itemIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    },

    // Optional: A top-level flag to indicate if ALL shipping groups are complete
    isFullyShipped: { type: Boolean, default: false }, // This will be true if BOTH invoiceShippingDetails.isShipped AND flatRateShippingDetails.isShipped are true (if applicable)
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
