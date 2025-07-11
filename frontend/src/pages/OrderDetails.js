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
    if (order?.shippingInvoiceUrl && !order?.shippingInvoicePaid) {
      toast.error('Shipping invoice must be paid before shipping the order.');
      return;
    }
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

  const hasPerProductShipping = order?.orderItems?.some(
    (item) => item.shippingCharge > 0
  );

  const requiresInvoice =
    order?.orderItems?.every(
      (item) =>
        item.shippingCharge === null ||
        item.shippingCharge === undefined ||
        item.shippingCharge === 0
    ) || false;

  const invoiceSent = !!order?.shippingInvoiceUrl;
  const invoicePaid = !!order?.shippingInvoicePaid;

  const showShippingForm =
    userInfo?.isAdmin &&
    order?.isPaid &&
    !order?.isShipped &&
    ((hasPerProductShipping && !order?.shippingInvoiceUrl) ||
      order?.shippingInvoicePaid);

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
                  Paid with Square on {new Date(order.paidAt).toLocaleString()}
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
                      {order.shippingPrice > 0
                        ? `$${order.shippingPrice.toFixed(2)}`
                        : requiresInvoice
                        ? invoiceSent
                          ? 'Awaiting Payment'
                          : 'TBD'
                        : hasPerProductShipping
                        ? 'Included'
                        : 'Pending'}
                    </Col>
                  </Row>
                  {order?.orderItems &&
                    order.orderItems.map(
                      (item, idx) =>
                        !item.requiresShippingInvoice &&
                        item.shippingCharge !== undefined && (
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
                        )
                    )}
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

          <div className='box'>
            <div className='body'>
              <title>Shipping Invoice</title>
              {userInfo.isAdmin && requiresInvoice && !invoiceSent && (
                <>
                  <h5 style={{ color: 'red' }}>Send Shipping Price</h5>
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
                    className='btn btn-primary mt-2'
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
                </>
              )}
              {invoicePaid && (
                <div className='mt-3'>
                  <strong>Shipping Status:</strong>{' '}
                  <MessageBox variant='success'>
                    Shipping Invoice Paid with Square on{' '}
                    {new Date(order.shippingPaidAt).toLocaleString()}
                  </MessageBox>
                </div>
              )}
            </div>
          </div>

          {showShippingForm && (
            <div className='box'>
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
