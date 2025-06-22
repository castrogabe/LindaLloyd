import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Col, Form, Button, Container } from 'react-bootstrap';
import CheckoutSteps from '../components/CheckoutSteps';
import { Store } from '../Store';
import SkeletonPaymentMethod from '../components/skeletons/SkeletonPaymentMethod'; // lesson 12

export default function PaymentMethod() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  const [isPayPalSelected, setIsPayPalSelected] = useState(
    paymentMethod === 'PayPal'
  );

  const [isStripeSelected, setIsStripeSelected] = useState(
    paymentMethod === 'Stripe'
  );

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();

    const selectedMethod = isPayPalSelected ? 'PayPal' : 'Stripe';

    ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: selectedMethod });
    localStorage.setItem('paymentMethod', selectedMethod);
    navigate('/placeorder');
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
        <SkeletonPaymentMethod />
      ) : (
        <>
          <Helmet>
            <title>Payment Method</title>
          </Helmet>
          <br />
          <CheckoutSteps step1 step2 step3></CheckoutSteps>
          <Container className='small-container'>
            <br />
            <Col>
              <h4 className='box'>Select Payment Method</h4>
              <Form onSubmit={submitHandler}>
                <div className='mb-3'>
                  <div className='payment-option'>
                    <Form.Check
                      type='radio'
                      id='PayPal'
                      label='PayPal'
                      checked={isPayPalSelected}
                      onChange={() => {
                        setIsPayPalSelected(true);
                        setIsStripeSelected(false);
                      }}
                    />
                    <i className='fab fa-cc-paypal'></i>
                  </div>
                </div>

                <div className='mb-3'>
                  <div className='payment-option'>
                    <Form.Check
                      type='radio'
                      id='Stripe'
                      label='Credit Card'
                      checked={isStripeSelected}
                      onChange={() => {
                        setIsStripeSelected(true);
                        setIsPayPalSelected(false);
                      }}
                    />
                    <i className='fab fa-cc-stripe'></i>
                  </div>
                </div>

                <div className='mb-3'>
                  <Button type='submit'>Continue</Button>
                </div>
              </Form>
            </Col>
          </Container>
        </>
      )}
    </div>
  );
}

// step 1 (Cart)
// step 2 (ShippingAddress)
// step 3 (PaymentMethod) <= CURRENT STEP
// step 4 (PlaceOrder)
// lands on OrderDetails for payment
