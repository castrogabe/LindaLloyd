// rfc
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import CheckoutSteps from '../components/CheckoutSteps';
import SkeletonShippingAddress from '../components/skeletons/SkeletonShippingAddress'; // lesson 12

export default function ShippingAddress() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;

  const [fullName, setFullName] = useState(shippingAddress.fullName || '');
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [states, setStates] = useState(shippingAddress.states || ''); // states not state
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ''
  );
  const [country, setCountry] = useState(shippingAddress.country || '');

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping');
    }
  }, [userInfo, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: {
        fullName,
        address,
        city,
        states,
        postalCode,
        country,
      },
    });
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({
        fullName,
        address,
        city,
        states,
        postalCode,
        country,
      })
    );
    navigate('/payment');
  };

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
      {isLoading ? (
        <SkeletonShippingAddress />
      ) : (
        <>
          <Helmet>
            <title>Shipping Address</title>
          </Helmet>
          <br />
          <CheckoutSteps step1 step2></CheckoutSteps>
          <br />
          <div className='container small-container'>
            <h1 className='box'>Shipping Address</h1>
            <Form onSubmit={submitHandler}>
              <Form.Group className='mb-3' controlId='fullName'>
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className='mb-3' controlId='address'>
                <Form.Label>Full Address, Bld, Apt, Space</Form.Label>
                <Form.Control
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className='mb-3' controlId='city'>
                <Form.Label>City</Form.Label>
                <Form.Control
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className='mb-3' controlId='states'>
                <Form.Label>State</Form.Label>
                <Form.Control
                  value={states}
                  onChange={(e) => setStates(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className='mb-3' controlId='postalCode'>
                <Form.Label>Postal Code</Form.Label>
                <Form.Control
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className='mb-3' controlId='country'>
                <Form.Label>Country</Form.Label>
                <Form.Control
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
              </Form.Group>
              <div className='mb-3'>
                <Button variant='primary' type='submit'>
                  Continue
                </Button>
              </div>
            </Form>
          </div>
        </>
      )}
    </div>
  );
}
// step 1 (Cart)
// step 2 (ShippingAddress) <= CURRENT STEP
// step 3 (PaymentMethod) select radial button for PayPal or Stripe
// step 4 (PlaceOrder)
// lands on Order for payment
