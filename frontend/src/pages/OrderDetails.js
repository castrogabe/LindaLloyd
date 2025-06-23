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
  const [deliveryDays, setDeliveryDays] = useState('');
  const [carrierName, setCarrierName] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  const [{ loading, error, order, loadingShipped, successShipped }, dispatch] =
    useReducer(reducer, {
      loading: true,
      order: {},
      error: '',
    });

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
      return navigate('/login');
    }
    if (!order._id || successShipped || order._id !== orderId) {
      fetchOrder();
      if (successShipped) {
        dispatch({ type: 'SHIPPED_RESET' });
      }
    }
  }, [order, userInfo, orderId, navigate, successShipped]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'SHIPPED_REQUEST' });
      const { data } = await axios.put(
        `/api/orders/${order._id}/shipped`,
        {
          deliveryDays,
          carrierName,
          trackingNumber,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'SHIPPED_SUCCESS', payload: data });
      toast.success('Order has shipped', { autoClose: 1000 });
    } catch (err) {
      dispatch({ type: 'SHIPPED_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  };

  return loading ? (
    <Row>
      {[...Array(8).keys()].map((i) => (
        <Col key={i} md={12} className='mb-3'>
          <SkeletonOrderDetails />
        </Col>
      ))}
    </Row>
  ) : error ? (
    <MessageBox variant='danger'>{error}</MessageBox>
  ) : (
    <div className='content'>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <br />
      <h4 className='box'>Order: {orderId}</h4>
      <Row>
        <Col md={6}>
          <div className='box'>
            <div className='body'>
              <title>Items</title>
              <ListGroup variant='flush'>
                {order.orderItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className='align-items-center'>
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className='img-fluid rounded img-thumbnail'
                        ></img>{' '}
                        <Link className='link' to={`/product/${item.slug}`}>
                          {item.name}
                        </Link>
                      </Col>
                      <Col md={3}>Qty: {item.quantity}</Col>
                      <Col md={3}>${item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </div>

          <div className='box'>
            <div className='body'>
              <title>Shipping</title>
              <div>
                <strong>Name:</strong> {order.shippingAddress.fullName}
                <br />
                <strong>Address:</strong> {order.shippingAddress.address}
                <br />
                <strong>City:</strong> {order.shippingAddress.city}
                <br />
                <strong>State:</strong> {order.shippingAddress.states}
                <br />
                <strong>Postal Code:</strong> {order.shippingAddress.postalCode}
                <br />
                <strong>Country:</strong> {order.shippingAddress.country}
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

          <div className='box'>
            <div className='body'>
              <title>Payment</title>
              <div>
                <strong>Status:</strong>{' '}
                {order.isPaid ? (
                  <MessageBox variant='success'>
                    Paid with Square on{' '}
                    {new Date(order.paidAt).toLocaleString()}
                  </MessageBox>
                ) : (
                  <MessageBox variant='warning'>
                    Payment pending. You will receive a separate Square payment
                    link to complete the purchase.
                  </MessageBox>
                )}
              </div>
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
                    <Col>${order.shippingPrice.toFixed(2)}</Col>
                  </Row>
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

          {userInfo.isAdmin && order.isPaid && !order.isShipped && (
            <Form>
              {loadingShipped && <SkeletonOrderDetails />}
              <div className='d-grid'>
                {/* send shipping confirmation email when order ships */}
                <h6>Admin fill in the fields below to send to customer</h6>
                <Form.Group className='mb-3' controlId='days'>
                  <Form.Label>Delivery Days</Form.Label>
                  <Form.Control
                    value={deliveryDays}
                    onChange={(e) => setDeliveryDays(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className='mb-3' controlId='name'>
                  <Form.Label>Carrier Name</Form.Label>
                  <Form.Control
                    value={carrierName}
                    onChange={(e) => setCarrierName(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className='mb-3' controlId='slug'>
                  <Form.Label>Tracking Number</Form.Label>
                  <Form.Control
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button type='button' onClick={submitHandler}>
                  Order Shipped
                </Button>
              </div>
            </Form>
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
