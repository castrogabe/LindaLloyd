import Axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Store } from '../Store';
import CheckoutSteps from '../components/CheckoutSteps';
import SkeletonPlaceOrder from '../components/skeletons/SkeletonPlaceOrder';

export default function PlaceOrder() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const [estimatedTaxPrice, setEstimatedTaxPrice] = useState(0);
  const [estimatedTotalPrice, setEstimatedTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStarted, setLoadingStarted] = useState(false);

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

  cart.itemsPrice = round2(
    cart.cartItems.reduce(
      (a, c) => a + (c.salePrice || c.price) * c.quantity,
      0
    )
  );
  const calcShipping = cart.cartItems.reduce(
    (acc, item) => acc + (item.shippingCharge || 0) * item.quantity,
    0
  );
  cart.shippingPrice = round2(calcShipping);

  const fetchTaxEstimate = async () => {
    try {
      const { data } = await Axios.post('/api/tax/estimate', {
        items: cart.cartItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.salePrice || item.price,
        })),
        shippingPrice: cart.shippingPrice,
        locationId: process.env.REACT_APP_SQUARE_SANDBOX_LOCATION_ID,
        shippingAddress: {
          ...cart.shippingAddress,
          email: userInfo.email,
          fullName: cart.shippingAddress.fullName,
        },
      });
      setEstimatedTaxPrice(Number(data.taxPrice));
      setEstimatedTotalPrice(Number(data.totalPrice));
    } catch (err) {
      console.error('Tax estimation failed:', getError(err));
      toast.error('Failed to get tax estimate. Please check your address.', {
        autoClose: 1000,
      });
      setEstimatedTaxPrice(0);
      setEstimatedTotalPrice(round2(cart.itemsPrice + cart.shippingPrice));
    }
  };

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, navigate]);

  useEffect(() => {
    if (
      cart.shippingAddress.address &&
      cart.shippingAddress.city &&
      cart.shippingAddress.states &&
      cart.shippingAddress.postalCode &&
      cart.shippingAddress.country &&
      cart.cartItems.length > 0
    ) {
      fetchTaxEstimate();
    } else {
      setEstimatedTaxPrice(0);
      setEstimatedTotalPrice(round2(cart.itemsPrice + cart.shippingPrice));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    cart.itemsPrice,
    cart.shippingPrice,
    cart.shippingAddress,
    cart.cartItems,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const placeOrderHandler = async () => {
    if (!cart.paymentMethod) {
      toast.error('Please select a payment method.');
      navigate('/payment');
      return;
    }
    try {
      setLoadingStarted(true);

      const { data } = await Axios.post(
        '/api/orders',
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          shippingPrice: cart.shippingPrice,
          taxPrice: estimatedTaxPrice,
          totalPrice: estimatedTotalPrice,
          paymentMethod: cart.paymentMethod,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );

      const { order } = data;
      ctxDispatch({ type: 'CART_CLEAR' });
      localStorage.removeItem('cartItems');

      toast.success('Order created. Redirecting to payment...', {
        autoClose: 1000,
      });
      navigate(`/order/${order._id}/payment`); // <- navigates to OrderPayment
    } catch (err) {
      setLoadingStarted(false);
      toast.error(getError(err));
    }
  };

  return (
    <div className='content'>
      {isLoading ? (
        <SkeletonPlaceOrder />
      ) : (
        <>
          <br />
          <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
          <Helmet>
            <title>Place Order</title>
          </Helmet>
          <br />
          <h1 className='box'>
            <i
              className='fas fa-lock'
              style={{ color: 'green', marginRight: '10px' }}
            ></i>
            Secure Checkout - Place Your Order
          </h1>
          <Row>
            <Col md={8}>
              <Card className='box'>
                <Card.Body>
                  <Card.Title>Items</Card.Title>
                  <ListGroup variant='flush'>
                    {cart.cartItems.map((item) => (
                      <ListGroup.Item key={item._id}>
                        <Row className='align-items-center'>
                          <Col md={6}>
                            <img
                              src={item.image}
                              alt={item.name}
                              className='img-fluid rounded img-thumbnail'
                            />{' '}
                            <Link to={`/product/${item.slug}`}>
                              {item.name}
                            </Link>
                          </Col>
                          <Col md={3}>
                            <span>{item.quantity}</span>
                          </Col>
                          <Col md={3}>
                            ${(item.salePrice || item.price).toFixed(2)}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  <Link to='/cart'>Edit</Link>
                </Card.Body>
              </Card>

              <Card className='box'>
                <Card.Body>
                  <Card.Text>
                    {cart.shippingAddress.fullName} <br />
                    {cart.shippingAddress.address}
                    <br />
                    {cart.shippingAddress.city}, {cart.shippingAddress.states}.{' '}
                    {cart.shippingAddress.postalCode}
                    <br />
                    {cart.shippingAddress.country}
                  </Card.Text>
                  <Link to='/shipping'>Edit</Link>
                </Card.Body>
              </Card>

              <Card className='box'>
                <Card.Body>
                  <Card.Title>Payment</Card.Title>
                  <Card.Text>
                    <strong>Method:</strong> {cart.paymentMethod}
                  </Card.Text>
                  <Link to='/payment'>Edit</Link>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Order Summary</Card.Title>
                  <ListGroup variant='flush'>
                    <ListGroup.Item>
                      <Row>
                        <Col>Quantity</Col>
                        <Col>
                          {cart.cartItems.reduce(
                            (acc, item) => acc + item.quantity,
                            0
                          )}
                        </Col>
                      </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <Row>
                        <Col>Items</Col>
                        <Col>${cart.itemsPrice.toFixed(2)}</Col>
                      </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <Row>
                        <Col>Shipping</Col>
                        <Col>
                          {cart.shippingPrice > 0 ? (
                            <>
                              ${cart.shippingPrice.toFixed(2)}
                              <br />
                              <small className='text-muted'>
                                (Includes flat-rate shipping items)
                              </small>
                            </>
                          ) : cart.cartItems.some(
                              (item) => item.requiresShippingInvoice
                            ) ? (
                            <span className='text-success'>
                              Invoiced After Purchase
                            </span>
                          ) : (
                            <span className='text-muted'>Free Shipping</span>
                          )}
                        </Col>
                      </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <Row>
                        <Col>Tax</Col>
                        <Col>${Number(estimatedTaxPrice).toFixed(2)}</Col>
                      </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <Row>
                        <Col>
                          <strong>Order Total</strong>
                        </Col>
                        <Col>
                          <strong>${estimatedTotalPrice.toFixed(2)}</strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <div className='d-grid'>
                        <Button
                          type='button'
                          onClick={placeOrderHandler}
                          disabled={cart.cartItems.length === 0}
                        >
                          Place Order
                        </Button>
                      </div>
                      {loadingStarted && (
                        <>
                          <p className='text-center text-danger mt-3 fade-in'>
                            <i className='fas fa-spinner fa-spin'></i>{' '}
                            Processing order, please do not refresh the page...
                          </p>
                          <SkeletonPlaceOrder />
                        </>
                      )}
                      <div className='box'>
                        <Card.Title>Payment Method</Card.Title>
                        <p>
                          <strong>Method:</strong> Square
                        </p>
                      </div>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}

// step 1 (Cart)
// step 2 (ShippingAddress)
// step 3 (PlaceOrder) <= CURRENT STEP
// step 4 (OrderPayment)
// lands on OrderDetails for payment
