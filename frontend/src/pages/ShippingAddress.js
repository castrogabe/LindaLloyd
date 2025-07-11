import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import CheckoutSteps from '../components/CheckoutSteps';
import SkeletonShippingAddress from '../components/skeletons/SkeletonShippingAddress';

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
  const [states, setStates] = useState(shippingAddress.states || '');
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ''
  );

  const [country, setCountry] = useState(shippingAddress.country || 'US');
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(!shippingAddress?.address); // default to form if no address

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping');
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    const updatedAddress = {
      fullName,
      address,
      city,
      states,
      postalCode,
      country,
    };

    ctxDispatch({ type: 'SAVE_SHIPPING_ADDRESS', payload: updatedAddress });
    localStorage.setItem('shippingAddress', JSON.stringify(updatedAddress));

    // ✅ Sync into userInfo so Profile sees it too
    const updatedUserInfo = {
      ...userInfo,
      shippingAddress: updatedAddress,
    };

    ctxDispatch({ type: 'USER_SIGNIN', payload: updatedUserInfo });
    localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));

    try {
      await axios.put('/api/users/address', updatedAddress, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      navigate('/placeorder');
    } catch (err) {
      console.error(
        '💥 Failed to save shipping address:',
        err.response?.data || err.message
      );
    }
  };

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
          <CheckoutSteps step1 step2 />
          <br />
          <div className='container small-container'>
            <h1 className='box'>Shipping Address</h1>

            {!showForm && shippingAddress?.address ? (
              <div className='saved-address-box'>
                <p>
                  <strong>{shippingAddress.fullName}</strong>
                </p>
                <p>
                  {shippingAddress.address},
                  <br />
                  {shippingAddress.city}, {shippingAddress.states},{' '}
                  {shippingAddress.postalCode},
                  <br />
                  {shippingAddress.country}
                </p>

                <div className='mb-3'>
                  <Button
                    variant='primary'
                    onClick={() => navigate('/placeorder')}
                  >
                    Use This Address
                  </Button>{' '}
                  <Button variant='secondary' onClick={() => setShowForm(true)}>
                    Enter New Address
                  </Button>
                </div>
              </div>
            ) : (
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
                  <Form.Select
                    value={states}
                    onChange={(e) => setStates(e.target.value)}
                    required
                  >
                    <option value=''>-- Select a State --</option>
                    <option value='AL'>Alabama</option>
                    <option value='AK'>Alaska</option>
                    <option value='AZ'>Arizona</option>
                    <option value='AR'>Arkansas</option>
                    <option value='CA'>California</option>
                    <option value='CO'>Colorado</option>
                    <option value='CT'>Connecticut</option>
                    <option value='DE'>Delaware</option>
                    <option value='FL'>Florida</option>
                    <option value='GA'>Georgia</option>
                    <option value='HI'>Hawaii</option>
                    <option value='ID'>Idaho</option>
                    <option value='IL'>Illinois</option>
                    <option value='IN'>Indiana</option>
                    <option value='IA'>Iowa</option>
                    <option value='KS'>Kansas</option>
                    <option value='KY'>Kentucky</option>
                    <option value='LA'>Louisiana</option>
                    <option value='ME'>Maine</option>
                    <option value='MD'>Maryland</option>
                    <option value='MA'>Massachusetts</option>
                    <option value='MI'>Michigan</option>
                    <option value='MN'>Minnesota</option>
                    <option value='MS'>Mississippi</option>
                    <option value='MO'>Missouri</option>
                    <option value='MT'>Montana</option>
                    <option value='NE'>Nebraska</option>
                    <option value='NV'>Nevada</option>
                    <option value='NH'>New Hampshire</option>
                    <option value='NJ'>New Jersey</option>
                    <option value='NM'>New Mexico</option>
                    <option value='NY'>New York</option>
                    <option value='NC'>North Carolina</option>
                    <option value='ND'>North Dakota</option>
                    <option value='OH'>Ohio</option>
                    <option value='OK'>Oklahoma</option>
                    <option value='OR'>Oregon</option>
                    <option value='PA'>Pennsylvania</option>
                    <option value='RI'>Rhode Island</option>
                    <option value='SC'>South Carolina</option>
                    <option value='SD'>South Dakota</option>
                    <option value='TN'>Tennessee</option>
                    <option value='TX'>Texas</option>
                    <option value='UT'>Utah</option>
                    <option value='VT'>Vermont</option>
                    <option value='VA'>Virginia</option>
                    <option value='WA'>Washington</option>
                    <option value='WV'>West Virginia</option>
                    <option value='WI'>Wisconsin</option>
                    <option value='WY'>Wyoming</option>
                  </Form.Select>
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
                  <Form.Select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  >
                    <option value='US'>United States</option>
                    {/* <option value='MX'>Mexico</option>
                    <option value='CA'>Canada</option>
                    <option value='GB'>United Kingdom</option>
                    <option value='AU'>Australia</option>
                    <option value='DE'>Germany</option>
                    <option value='FR'>France</option> */}
                  </Form.Select>
                </Form.Group>

                <div className='mb-3'>
                  <Button variant='primary' type='submit'>
                    Continue
                  </Button>
                </div>
              </Form>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// step 1 (Cart)
// step 2 (ShippingAddress) <= CURRENT STEP
// step 3 (PlaceOrder)
// step 4 (OrderPayment)
// lands on OrderDetails for payment
