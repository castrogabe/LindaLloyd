import React, { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import { Row, Col, Button, Card, ListGroup } from 'react-bootstrap';
import MessageBox from '../components/MessageBox';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SkeletonCart from '../components/skeletons/SkeletonCart';

export default function Cart() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  const removeItemHandler = (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping');
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay (remove this in your actual implementation)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='content'>
      {isLoading ? (
        <SkeletonCart />
      ) : (
        <>
          <Helmet>
            <title>Shopping Cart</title>
          </Helmet>
          <br />
          <h4 className='box'>Shopping Cart</h4>
          <Row>
            <Col md={8}>
              {cartItems.length === 0 ? (
                <MessageBox>
                  Cart is empty. <Link to='/'> Go Shopping</Link>
                </MessageBox>
              ) : (
                <ListGroup>
                  {cartItems.map((item) => (
                    <ListGroup.Item
                      key={item._id}
                      className='cart-item d-flex align-items-center'
                    >
                      {/* Product Image */}
                      <Col xs={2} md={2}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className='img-fluid rounded img-thumbnail'
                        />
                      </Col>

                      {/* Product Name */}
                      <Col xs={4} md={4} className='cart-item-name'>
                        <Link className='link' to={`/product/${item.slug}`}>
                          {item.name}
                        </Link>
                      </Col>

                      {/* Quantity Selector */}
                      <Col
                        xs={3}
                        md={3}
                        className='d-flex align-items-center justify-content-center'
                      >
                        <Button
                          onClick={() =>
                            updateCartHandler(item, item.quantity - 1)
                          }
                          variant='light'
                          disabled={item.quantity === 1}
                        >
                          <i className='fas fa-minus-circle'></i>
                        </Button>
                        <span className='mx-2'>{item.quantity}</span>
                        <Button
                          variant='light'
                          onClick={() =>
                            updateCartHandler(item, item.quantity + 1)
                          }
                          disabled={item.quantity === item.countInStock}
                        >
                          <i className='fas fa-plus-circle'></i>
                        </Button>
                      </Col>

                      {/* Product Price */}
                      <Col
                        xs={2}
                        md={2}
                        className='cart-item-price text-center'
                      >
                        ${item.price}
                      </Col>

                      {/* Remove Button */}
                      <Col xs={1} md={1} className='text-end'>
                        <Button
                          onClick={() => removeItemHandler(item)}
                          variant='light'
                        >
                          <i className='fas fa-trash'></i>
                        </Button>
                      </Col>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Col>

            <Col md={4}>
              <Card>
                <Card.Body>
                  <ListGroup variant='flush'>
                    <ListGroup.Item>
                      <h3>
                        Subtotal (
                        {cartItems.reduce((a, c) => a + c.quantity, 0)} items) :
                        $
                        {cartItems.reduce(
                          (a, c) => a + c.price * c.quantity,
                          0
                        )}
                      </h3>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <div className='d-grid'>
                        <Button
                          type='button'
                          variant='primary'
                          onClick={checkoutHandler}
                          disabled={cartItems.length === 0}
                        >
                          Proceed to Checkout
                        </Button>
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

// step 1 (Cart) <= CURRENT STEP
// step 2 (ShippingAddress)
// step 3 (PlaceOrder)
// step 4 (OrderPayment)
// lands on OrderDetails for payment
