import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button, Col, Row, ListGroup, Form } from 'react-bootstrap';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import { toast } from 'react-toastify';
import SkeletonOrderDetails from '../components/skeletons/SkeletonOrderDetails';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'SHIPPED_REQUEST':
      return { ...state, loadingShipped: true };
    case 'SHIPPED_SUCCESS':
      return { ...state, loadingShipped: false, successShipped: true };
    case 'SHIPPED_FAIL':
      return { ...state, loadingShipped: false };
    case 'SHIPPED_RESET':
      return {
        ...state,
        loadingShipped: false,
        successShipped: false,
      };
    default:
      return state;
  }
}

export default function OrderDetails() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();
  const [sendingInvoice, setSendingInvoice] = useState(false);
  const [shippingPrice, setShippingPrice] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('');
  const [carrierName, setCarrierName] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  const [{ loading, error, order, loadingShipped, successShipped }, dispatch] =
    useReducer(reducer, {
      loading: true,
      order: {
        orderItems: [],
        isPaid: false,
        isShipped: false,
        shippingInvoiceUrl: null,
        shippingInvoicePaid: false,
        shippingAddress: {
          fullName: '',
          address: '',
          city: '',
          states: '',
          postalCode: '',
          country: '',
        },
        itemsPrice: 0,
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: 0,
      },
      error: '',
      loadingShipped: false,
      successShipped: false,
    });

  const isPaid = order?.isPaid ?? false;

  useEffect(() => {
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

    if (!userInfo) {
      navigate('/login');
      return;
    }

    // Always fetch when no order or when orderId changes
    if (!order || order._id !== orderId || successShipped) {
      fetchOrder();
      if (successShipped) dispatch({ type: 'SHIPPED_RESET' });
    }
  }, [orderId, userInfo, navigate, order, successShipped]);

  const submitHandler = async (e) => {
    e.preventDefault();
    // Your existing validation here. This refers to the 'shipped' action for the overall order.
    // If you want to prevent shipping any part of the order until the invoice is paid,
    // this check is fine. If you want to allow shipping of flat-rate items independently,
    // this check might need to be more nuanced or moved.
    if (
      requiresInvoiceOverall &&
      order?.shippingInvoiceUrl &&
      !order?.shippingInvoicePaid
    ) {
      toast.error(
        'Shipping invoice for relevant items must be paid before confirming overall order shipment.'
      );
      return;
    }
    // You might want to consider *which* items are being marked shipped.
    // For a hybrid order, marking the whole order as 'isShipped' might be premature
    // if the invoiced items are still awaiting payment/shipment.
    // It depends on your business logic: can part of an order ship?
    // For now, assuming isShipped applies to the *entire* order for the tracking info.

    try {
      dispatch({ type: 'SHIPPED_REQUEST' });
      const { data } = await axios.put(
        `/api/orders/${order._id}/shipped`,
        { deliveryDays, carrierName, trackingNumber },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'SHIPPED_SUCCESS', payload: data });
      toast.success('Order has shipped', { autoClose: 1000 });
    } catch (err) {
      dispatch({ type: 'SHIPPED_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  };

  // --- NEW/UPDATED LOGIC FOR CLASSIFYING ITEMS ---
  const itemsRequiringInvoice =
    order?.orderItems?.filter((item) => item.requiresShippingInvoice) || [];

  const itemsWithFlatRateShipping =
    order?.orderItems?.filter(
      (item) =>
        item.useFlatRateShipping ||
        (item.shippingCharge > 0 && !item.requiresShippingInvoice)
    ) || [];

  const itemsWithFreeShipping =
    order?.orderItems?.filter(
      (item) =>
        !item.useFlatRateShipping &&
        item.shippingCharge === 0 &&
        !item.requiresShippingInvoice
    ) || [];

  // A more robust check for a 'hybrid' order (optional, but useful for specific UI messages)
  const isOrderHybrid =
    itemsRequiringInvoice.length > 0 &&
    (itemsWithFlatRateShipping.length > 0 || itemsWithFreeShipping.length > 0);

  const requiresInvoiceOverall = itemsRequiringInvoice.length > 0;
  const hasFlatRateShippingOverall =
    itemsWithFlatRateShipping.length > 0 || itemsWithFreeShipping.length > 0; // Simplified this combining free shipping here

  const invoiceSent = !!order?.shippingInvoiceUrl;
  const invoicePaid = !!order?.shippingInvoicePaid;

  // *** CRITICAL CHANGE HERE ***
  // Condition for showing the "Send Shipping Invoice" form
  // It only cares about its own status
  const showSendInvoiceForm =
    userInfo?.isAdmin &&
    order?.isPaid && // Order must be initially paid
    requiresInvoiceOverall && // There are items requiring an invoice
    !invoiceSent; // The invoice hasn't been sent yet

  // *** CRITICAL CHANGE HERE ***
  // Condition for showing the "Admin Prepaid Shipping Form"
  // It only cares about its own status regarding flat-rate/free items,
  // and whether the overall order has been shipped.
  // It should NOT be blocked by the invoice payment status if you want them to appear independently.
  const showShipOrderForm =
    userInfo?.isAdmin &&
    order?.isPaid && // Order must be initially paid
    !order?.isShipped && // The overall order is not yet marked as shipped
    hasFlatRateShippingOverall; // There are items that are either flat-rate or free shipping

  useEffect(() => {
    if (order?.isShipped) {
      setDeliveryDays(order.deliveryDays || '');
      setCarrierName(order.carrierName || '');
      setTrackingNumber(order.trackingNumber || '');
    }
  }, [order]);

  const handleSendShippingInvoice = async () => {
    if (sendingInvoice) return;
    setSendingInvoice(true);
    try {
      const { data } = await axios.put(
        `/api/orders/${orderId}/shipping-price`,
        { shippingPrice },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      toast.success('Shipping invoice sent', { autoClose: 1000 });
      dispatch({ type: 'FETCH_SUCCESS', payload: data.order });
    } catch (err) {
      toast.error(getError(err));
    } finally {
      setSendingInvoice(false);
    }
  };

  // Function to format date (MM-DD-YYYY)
  function formatDate(dateString) {
    if (!dateString) return ''; // return empty string if date is null or undefined
    const dateObject = new Date(dateString);
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');
    const year = dateObject.getFullYear();
    return `${month}-${day}-${year}`;
  }

  // EARLY RETURNS
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
          <div className='box'>
            <div className='body'>
              <title>Items</title>
              <ListGroup variant='flush'>
                {order?.orderItems && order.orderItems.length > 0 ? (
                  order.orderItems.map((item) => (
                    <ListGroup.Item key={item._id}>
                      <Row className='align-items-center'>
                        <Col md={6}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className='img-fluid rounded img-thumbnail'
                          />
                          <Link className='link' to={`/product/${item.slug}`}>
                            {item.name}
                          </Link>
                          <br />
                          {/* Display specific shipping info for each item */}
                          {item.requiresShippingInvoice ? (
                            <small style={{ color: 'green' }}>
                              Shipping Invoiced After Purchase
                            </small>
                          ) : item.useFlatRateShipping ||
                            item.shippingCharge > 0 ? (
                            <small style={{ color: 'gray' }}>
                              Flat Rate: ${item.shippingCharge.toFixed(2)}
                            </small>
                          ) : (
                            <small style={{ color: 'green' }}>
                              Free Shipping Included
                            </small>
                          )}
                        </Col>
                        <Col md={3}>Qty: {item.quantity}</Col>
                        <Col md={3}>
                          ${(item.salePrice || item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item>No items found in this order.</ListGroup.Item>
                )}
              </ListGroup>
            </div>
          </div>

          <div className='box'>
            <div className='body'>
              <title>Payment</title>
              <strong>Purchase Status:</strong>{' '}
              {isPaid ? (
                <MessageBox variant='success'>
                  Paid with Square on {formatDate(order.paidAt)}
                </MessageBox>
              ) : (
                <MessageBox variant='warning'>
                  Payment pending. You will receive a separate Square payment
                  link to complete the purchase.
                </MessageBox>
              )}
            </div>
          </div>

          <div className='box'>
            <div className='body'>
              <title>Shipping</title>
              <div>
                {order.shippingAddress.fullName}
                <br />
                {order.shippingAddress.address}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.states}.{' '}
                {order.shippingAddress.postalCode}
                <br />
                {order.shippingAddress.country}
              </div>
              {order.isShipped ? (
                <MessageBox variant='success'>
                  Shipped on {new Date(order.shippedAt).toLocaleString()}
                </MessageBox>
              ) : (
                <MessageBox variant='danger'>Not Shipped</MessageBox>
              )}

              {/* Display Carrier and Tracking for Shipped Orders (regardless of method) */}
              {order.isShipped && (
                <div className='mt-3'>
                  <p className='mb-1'>
                    <strong>Delivery Days:</strong> {order.deliveryDays}
                  </p>
                  <p className='mb-1'>
                    <strong>Carrier:</strong> {order.carrierName}
                  </p>
                  <p className='mb-0'>
                    <strong>Tracking Number:</strong> {order.trackingNumber}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Col>

        <Col md={6}>
          <div className='box'>
            <div className='body'>
              <title>Order Summary</title>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${order.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>
                      {
                        order.shippingPrice > 0
                          ? `$${order.shippingPrice.toFixed(2)}`
                          : requiresInvoiceOverall // Check the overall flag
                          ? invoiceSent
                            ? 'Awaiting Payment'
                            : 'TBD (Invoice Pending)' // More descriptive
                          : hasFlatRateShippingOverall
                          ? 'Included / Flat Rate' // For orders with only flat rate or free
                          : 'Free Shipping' // Explicitly for free items if no other shipping
                      }
                    </Col>
                  </Row>
                  {/* Display per-item shipping details for flat-rate items */}
                  {itemsWithFlatRateShipping.length > 0 &&
                    itemsWithFlatRateShipping.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          fontSize: '0.85em',
                          color: '#666',
                          paddingLeft: '1rem',
                        }}
                      >
                        {item.name}: ${item.shippingCharge.toFixed(2)} ×{' '}
                        {item.quantity}
                      </div>
                    ))}
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${order.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Total</strong>
                    </Col>
                    <Col>
                      <strong>${order.totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </div>
          </div>

          {/* ********************************************************************************** */}

          {/* Send Shipping Invoice Form */}
          {showSendInvoiceForm && (
            <div className='box'>
              {/* 🖼 Show ALL products that require a shipping invoice */}
              {itemsRequiringInvoice.length > 0 && (
                <div className='mb-3'>
                  {itemsRequiringInvoice.map((item) => (
                    <div
                      key={item._id}
                      className='d-flex align-items-center justify-content-center mb-2'
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className='img-thumbnail me-2' // Added margin-right
                        style={{
                          width: '60px',
                          height: '60px',
                          objectFit: 'cover',
                        }}
                      />
                      <strong>{item.name}</strong>
                    </div>
                  ))}
                </div>
              )}

              <p
                className='text-center text-muted mb-1'
                style={{ fontSize: '1.1em' }}
              >
                Shipping Invoiced After Purchase
              </p>

              {/* 🟥 Action heading */}
              <h5 className='text-center mb-3' style={{ color: 'red' }}>
                Send Shipping Price
              </h5>

              {/* 🧾 Shipping price form */}
              <Form.Group controlId='shippingPrice'>
                <Form.Control
                  type='number'
                  placeholder='Enter shipping price'
                  value={shippingPrice}
                  onChange={(e) => setShippingPrice(e.target.value)}
                />
              </Form.Group>

              <Button
                type='button'
                className='btn btn-primary mt-2 w-100'
                disabled={sendingInvoice}
                onClick={() => {
                  if (!shippingPrice || parseFloat(shippingPrice) <= 0) {
                    toast.error('Shipping price must be greater than zero');
                    return;
                  }
                  handleSendShippingInvoice();
                }}
              >
                {sendingInvoice ? 'Sending...' : 'Save & Send Invoice'}
              </Button>
            </div>
          )}

          {/* ********************************************************************************** */}

          {/* Admin Prepaid Shipping Form (for flat-rate/included items) */}
          {showShipOrderForm && (
            <div className='box'>
              {/* 📦 Show ALL products that are handled by this direct shipping form */}
              {(itemsWithFlatRateShipping.length > 0 ||
                itemsWithFreeShipping.length > 0) && (
                <div className='mb-3'>
                  {[...itemsWithFlatRateShipping, ...itemsWithFreeShipping].map(
                    (item) => (
                      <div
                        key={item._id}
                        className='d-flex align-items-center justify-content-center mb-2'
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className='img-thumbnail me-2' // Added margin-right
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                          }}
                        />
                        <strong>{item.name}</strong>
                      </div>
                    )
                  )}
                </div>
              )}

              <h6 className='text-center mt-3'>
                Admin fill in the fields below to send to customer
              </h6>

              <Form onSubmit={submitHandler}>
                <Form.Group className='mb-3' controlId='days'>
                  <Form.Label>Delivery Days</Form.Label>
                  <Form.Control
                    value={deliveryDays}
                    onChange={(e) => setDeliveryDays(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className='mb-2' controlId='carrierName'>
                  <Form.Label>Carrier Name</Form.Label>
                  <Form.Control
                    type='text'
                    value={carrierName}
                    onChange={(e) => setCarrierName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className='mb-2' controlId='trackingNumber'>
                  <Form.Label>Tracking Number</Form.Label>
                  <Form.Control
                    type='text'
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                  />
                </Form.Group>

                <Button
                  type='submit'
                  variant='primary'
                  className='w-100 mt-2'
                  disabled={loadingShipped}
                >
                  {loadingShipped ? 'Processing...' : 'Order Shipped'}
                </Button>
              </Form>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
}

// step 1 (Cart)
// step 2 (ShippingAddress)
// step 3 (PlaceOrder)
// step 4 (OrderPayment)
// lands on OrderDetails for payment <= CURRENT STEP
