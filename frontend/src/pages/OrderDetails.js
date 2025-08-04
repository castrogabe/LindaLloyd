// src/screens/OrderDetailsScreen.js (or whatever your main file is named)
import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store'; // Assuming this is your global store
import { getError } from '../utils';
import { toast } from 'react-toastify';
import SkeletonOrderDetails from '../components/skeletons/SkeletonOrderDetails';

// Import new components from orderDetails components folder
import AdminShippingActions from '../components/orderDetails/AdminShippingActions';
import OrderItemsCard from '../components/orderDetails/OrderItemsCard';
import OrderSummaryCard from '../components/orderDetails/OrderSummaryCard';
import PaymentStatusCard from '../components/orderDetails/PaymentStatusCard';
import ShippingAddressCard from '../components/orderDetails/ShippingAddressCard';
// AdminShippingForm used in AdminShippingActions

// Reducer for order details (keep it here)
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    // Specific shipping action states (keep these here for now)
    case 'MARK_INVOICE_SHIPPED_REQUEST':
    case 'MARK_FLAT_RATE_SHIPPED_REQUEST':
    case 'SHIP_INVOICE_REQUEST': // Keep old ones until refactor is complete
    case 'SHIP_FLATRATE_REQUEST':
      return { ...state, loading: true }; // Use general loading for now
    case 'MARK_INVOICE_SHIPPED_SUCCESS':
    case 'MARK_FLAT_RATE_SHIPPED_SUCCESS':
    case 'SHIP_INVOICE_SUCCESS':
    case 'SHIP_FLATRATE_SUCCESS':
      return { ...state, loading: false }; // Loading done
    case 'MARK_INVOICE_SHIPPED_FAIL':
    case 'SHIP_INVOICE_FAIL':
    case 'MARK_FLAT_RATE_SHIPPED_FAIL':
    case 'SHIP_FLATRATE_FAIL':
      return { ...state, loading: false, error: action.payload }; // Error handling
    default:
      return state;
  }
};

export default function OrderDetailsScreen() {
  // Renamed from OrderDetails for clarity
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const {
    state: { userInfo },
  } = useContext(Store); // Get userInfo from context

  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  });

  // State for Admin actions (e.g., sending invoice, shipping forms)
  const [sendingInvoice, setSendingInvoice] = useState(false);
  const [shippingPrice, setShippingPrice] = useState('');

  // Form inputs for Invoice Shipping details
  const [invoiceDeliveryDays, setInvoiceDeliveryDays] = useState('');
  const [invoiceCarrierName, setInvoiceCarrierName] = useState('');
  const [invoiceTrackingNumber, setInvoiceTrackingNumber] = useState('');

  // Form inputs for Flat Rate/Included Shipping details
  const [flatRateDeliveryDays, setFlatRateDeliveryDays] = useState('');
  const [flatRateCarrierName, setFlatRateCarrierName] = useState('');
  const [flatRateTrackingNumber, setFlatRateTrackingNumber] = useState('');

  // Derived state for conditional rendering (from order data)
  const requiresInvoiceOverall = order?.orderItems?.some(
    (item) => item.requiresShippingInvoice
  );
  const hasFlatRateShippingOverall = order?.orderItems?.some(
    (item) => item.useFlatRateShipping || item.shippingCharge > 0
  );

  // TODO: May use itemsRequiringInvoice and itemsWithFlatRateShipping later
  // const itemsRequiringInvoice =
  //   order?.orderItems?.filter((item) => item.requiresShippingInvoice) || [];
  // const itemsWithFlatRateShipping =
  //   order?.orderItems?.filter(
  //     (item) => item.useFlatRateShipping || item.shippingCharge > 0
  //   ) || [];

  // You might not need itemsWithFreeShipping explicitly here if handled by hasFlatRateShippingOverall
  const invoiceSent = !!order?.shippingInvoiceUrl;
  const invoicePaid = !!order?.shippingInvoicePaid;
  const invoiceItemsShipped = order?.invoiceShippingDetails?.isShipped ?? false;
  const flatRateItemsShipped =
    order?.flatRateShippingDetails?.isShipped ?? false;
  const isPaid = order?.isPaid ?? false;

  const mixedShippingMethods =
    requiresInvoiceOverall && hasFlatRateShippingOverall;

  // Refactored useEffect for fetching order data
  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    // Fetch if order is not loaded or orderId changes
    if (!order._id || order._id !== orderId) {
      fetchOrder();
    }
  }, [orderId, userInfo, navigate, order._id]); // Add order._id to dependencies

  // Handlers for API calls (kept in parent to manage state and dispatch)
  const handleSendShippingInvoice = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (sendingInvoice) return;
    setSendingInvoice(true);
    try {
      const { data } = await axios.put(
        `/api/orders/${orderId}/shipping-price`,
        { shippingPrice: Number(shippingPrice) },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      toast.success('Shipping invoice sent', { autoClose: 1000 });
      dispatch({ type: 'FETCH_SUCCESS', payload: data.order }); // Assuming backend sends {order: updatedOrder}
    } catch (err) {
      toast.error(getError(err));
    } finally {
      setSendingInvoice(false);
    }
  };

  const handleMarkShippingInvoicePaid = async () => {
    try {
      const { data } = await axios.put(
        `/api/orders/${orderId}/shipping-invoice-paid`,
        {},
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      toast.success('Shipping invoice marked as paid!');
      dispatch({ type: 'FETCH_SUCCESS', payload: data.order });
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const handleMarkInvoiceItemsShipped = async (shippingDetails) => {
    // Now accepts shippingDetails directly
    // No e.preventDefault() here, as the form handles it before calling this.
    try {
      dispatch({ type: 'MARK_INVOICE_SHIPPED_REQUEST' });
      const { data } = await axios.put(
        `/api/orders/${orderId}/mark-invoice-shipped`,
        shippingDetails, // Use the passed shippingDetails object
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      toast.success('Invoice items marked as shipped!');
      dispatch({ type: 'FETCH_SUCCESS', payload: data.order });
      setInvoiceDeliveryDays(''); // Clear form after success
      setInvoiceCarrierName('');
      setInvoiceTrackingNumber('');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'MARK_INVOICE_SHIPPED_FAIL', payload: getError(err) });
    }
  };

  const handleMarkFlatRateItemsShipped = async (shippingDetails) => {
    // Now accepts shippingDetails directly
    // No e.preventDefault() here.
    try {
      dispatch({ type: 'MARK_FLAT_RATE_SHIPPED_REQUEST' });
      const { data } = await axios.put(
        `/api/orders/${orderId}/mark-flat-rate-shipped`,
        shippingDetails, // Use the passed shippingDetails object
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      toast.success('Flat Rate/Included items marked as shipped!');
      dispatch({ type: 'FETCH_SUCCESS', payload: data.order });
      setFlatRateDeliveryDays(''); // Clear form after success
      setFlatRateCarrierName('');
      setFlatRateTrackingNumber('');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'MARK_FLAT_RATE_SHIPPED_FAIL', payload: getError(err) });
    }
  };

  // Helper for date formatting (can be a utils function too)
  function formatDate(dateString) {
    if (!dateString) return '';
    const dateObject = new Date(dateString);
    return `${(dateObject.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${dateObject
      .getDate()
      .toString()
      .padStart(2, '0')}-${dateObject.getFullYear()}`;
  }

  // EARLY RETURNS (keep these)
  if (loading) {
    return (
      <Row>
        {[...Array(8).keys()].map((i) => (
          <Col key={i} md={12} className='mb-3'>
            <SkeletonOrderDetails />
          </Col>
        ))}
      </Row>
    );
  }

  if (error) {
    return <MessageBox variant='danger'>{error}</MessageBox>;
  }

  if (!order || !order._id) {
    return (
      <MessageBox variant='danger'>Order not found or not loaded.</MessageBox>
    );
  }

  return (
    <div className='content'>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <br />
      {order && order._id && <h4 className='box'>Order: {order._id}</h4>}

      <Row>
        <Col md={6}>
          {/* Order Items Card */}
          <OrderItemsCard orderItems={order.orderItems} />

          {/* Payment Status Card */}
          <PaymentStatusCard
            isPaid={isPaid}
            paidAt={order.paidAt}
            formatDate={formatDate}
          />

          {/* Shipping Address Card */}
          <ShippingAddressCard
            shippingAddress={order.shippingAddress}
            order={order} // Pass full order for derived shipping status
            requiresInvoiceOverall={requiresInvoiceOverall}
            hasFlatRateShippingOverall={hasFlatRateShippingOverall}
            invoiceItemsShipped={invoiceItemsShipped}
            flatRateItemsShipped={flatRateItemsShipped}
          />
        </Col>

        <Col md={6}>
          {/* Order Summary Card */}
          <OrderSummaryCard
            order={order}
            requiresInvoiceOverall={requiresInvoiceOverall}
            hasFlatRateShippingOverall={hasFlatRateShippingOverall}
            invoiceSent={invoiceSent}
            invoicePaid={invoicePaid}
            invoiceItemsShipped={invoiceItemsShipped}
            handleMarkShippingInvoicePaid={handleMarkShippingInvoicePaid} // Pass handler down
            userInfo={userInfo} // Pass userInfo for admin checks
          />

          {/* Admin Shipping Actions (New Component) */}
          {userInfo?.isAdmin && (
            <AdminShippingActions
              order={order}
              userInfo={userInfo}
              requiresInvoiceOverall={requiresInvoiceOverall}
              hasFlatRateShippingOverall={hasFlatRateShippingOverall}
              invoiceSent={invoiceSent}
              invoicePaid={invoicePaid}
              invoiceItemsShipped={invoiceItemsShipped}
              flatRateItemsShipped={flatRateItemsShipped}
              mixedShippingMethods={mixedShippingMethods}
              shippingPrice={shippingPrice}
              setShippingPrice={setShippingPrice}
              sendingInvoice={sendingInvoice}
              handleSendShippingInvoice={handleSendShippingInvoice}
              invoiceDeliveryDays={invoiceDeliveryDays}
              setInvoiceDeliveryDays={setInvoiceDeliveryDays}
              invoiceCarrierName={invoiceCarrierName}
              setInvoiceCarrierName={setInvoiceCarrierName}
              invoiceTrackingNumber={invoiceTrackingNumber}
              setInvoiceTrackingNumber={setInvoiceTrackingNumber}
              handleMarkInvoiceItemsShipped={handleMarkInvoiceItemsShipped}
              flatRateDeliveryDays={flatRateDeliveryDays}
              setFlatRateDeliveryDays={setFlatRateDeliveryDays}
              flatRateCarrierName={flatRateCarrierName}
              setFlatRateCarrierName={setFlatRateCarrierName}
              flatRateTrackingNumber={flatRateTrackingNumber}
              setFlatRateTrackingNumber={setFlatRateTrackingNumber}
              handleMarkFlatRateItemsShipped={handleMarkFlatRateItemsShipped}
              loading={loading} // Pass main loading state
            />
          )}
        </Col>
      </Row>
    </div>
  );
}
