import Axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react'; // lesson 12
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Store } from '../Store';
import CheckoutSteps from '../components/CheckoutSteps';
import SkeletonPlaceOrder from '../components/skeletons/SkeletonPlaceOrder'; // lesson 12

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function PlaceOrder() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  // round2(10) => $10.00 SHIPPING PRICE IF LESS (>) THAN $100
  // IF OVER $101 SHIPPING IS FREE
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.05 * cart.itemsPrice); // TAX PRICE 5%
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const placeOrderHandler = async () => {
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
      dispatch({ type: 'CREATE_SUCCESS' });
      localStorage.removeItem('cartItems');
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart, navigate]);

  // lesson 12
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='content'>
      {/* lesson 12 */}
      {isLoading ? (
        <SkeletonPlaceOrder />
      ) : (
        <>
          <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
          <Helmet>
            <title>Place Order</title>
          </Helmet>
          <br />
          <h1 className='box'>Place Order</h1>
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
                            ></img>{' '}
                            <Link to={`/product/${item.slug}`}>
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
                  <Link to='/cart'>Edit</Link>
                </Card.Body>
              </Card>

              <Card className='box'>
                <Card.Body>
                  <Card.Text>
                    <text>
                      <strong>Name:</strong> {cart.shippingAddress.fullName}{' '}
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
                    </text>
                    <br />
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
                          {/* Calculate and display the total quantity of all items */}
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
                        <Col>${cart.shippingPrice.toFixed(2)}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Tax</Col>
                        <Col>${cart.taxPrice.toFixed(2)}</Col>
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
                      {loading && <SkeletonPlaceOrder />}
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
// step 3 (PaymentMethod) select radial button for PayPal or Stripe
// step 4 (PlaceOrder) <= CURRENT STEP
// lands on OrderDetails for payment
