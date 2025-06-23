import Axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import MessageBox from '../components/MessageBox';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Store } from '../Store';
import CheckoutSteps from '../components/CheckoutSteps';
import SkeletonPlaceOrder from '../components/skeletons/SkeletonPlaceOrder';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true, loadingStarted: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false, loadingStarted: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false, loadingStarted: false };
    default:
      return state;
  }
};

export default function PlaceOrder() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const [{ loading, loadingStarted }, dispatch] = useReducer(reducer, {
    loading: false,
    loadingStarted: false,
  });
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = 0; // Tax will be applied by Square later
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice;

  const placeOrderHandler = async () => {
    if (!cart.paymentMethod) {
      toast.error('Please select a payment method.');
      navigate('/payment');
      return;
    }
    try {
      dispatch({ type: 'CREATE_REQUEST' });

      const { data } = await Axios.post(
        '/api/orders',
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      ctxDispatch({ type: 'CART_CLEAR' });
      localStorage.removeItem('cartItems');

      setTimeout(() => {
        navigate(`/order/${data.order._id}/payment`);
      }, 1200); // 1.2 seconds for slightly smoother experience
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('paymentMethod') !== 'Square') {
      localStorage.setItem('paymentMethod', 'Square');
    }
    ctxDispatch({
      type: 'SAVE_PAYMENT_METHOD',
      payload: 'Square',
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='content'>
      {isLoading ? (
        <SkeletonPlaceOrder />
      ) : (
        <>
          <br />
          <CheckoutSteps step1 step2 step3></CheckoutSteps>
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
              <div className='box'>
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
                            ></img>{' '}
                            <Link className='link' to={`/product/${item.slug}`}>
                              {item.name}
                            </Link>
                          </Col>
                          <Col md={3}>
                            <span>{item.quantity}</span>
                          </Col>
                          <Col md={3}>${item.price}</Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  <Link className='link' to='/cart'>
                    Edit
                  </Link>
                </Card.Body>
              </div>

              <div className='box'>
                <Card.Body>
                  <div>
                    <strong>Name:</strong> {cart.shippingAddress.fullName}
                    <br />
                    <strong>Address: </strong>
                    {cart.shippingAddress.address}
                    <br />
                    <strong>Street: </strong> {cart.shippingAddress.city},
                    {cart.shippingAddress.states},
                    <br />
                    <strong>Zip Code: </strong>{' '}
                    {cart.shippingAddress.postalCode},
                    <br />
                    <strong>State: </strong> {cart.shippingAddress.states},
                    <br />
                    <strong>Country: </strong> {cart.shippingAddress.country}
                  </div>

                  <Link className='link' to='/shipping'>
                    Edit
                  </Link>
                </Card.Body>
              </div>
            </Col>

            <Col md={4}>
              <div className='box'>
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
                      <MessageBox variant='warning'>
                        Shipping is not included. You will receive a separate
                        invoice after your purchase based on item size, weight,
                        and destination.
                      </MessageBox>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <Row>
                        <Col>Estimated Tax</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>
                          <strong> Order Total</strong>
                        </Col>
                        <Col>
                          <strong>${cart.totalPrice.toFixed(2)}</strong>
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
              </div>
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
