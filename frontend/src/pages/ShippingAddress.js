import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import CheckoutSteps from '../components/CheckoutSteps';
import SkeletonShippingAddress from '../components/skeletons/SkeletonShippingAddress';
import { stateCountyMap } from '../helpers/stateCountyMap';

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
  const [county, setCounty] = useState(shippingAddress.county || '');
  const [country, setCountry] = useState(shippingAddress.country || 'USA');

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
      county,
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

    await axios.put('/api/users/address', updatedAddress, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });

    navigate('/placeorder');
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
                  County: {shippingAddress.county},
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
                    onChange={(e) => {
                      setStates(e.target.value);
                      setCounty('');
                    }}
                    required
                  >
                    <option value=''>Select State</option>
                    {Object.keys(stateCountyMap).map((abbr) => (
                      <option key={abbr} value={abbr}>
                        {abbr}
                      </option>
                    ))}
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

                <Form.Group className='mb-3' controlId='county'>
                  <Form.Label>County</Form.Label>
                  <Form.Select
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    required
                  >
                    <option value=''>Select County</option>
                    {(stateCountyMap[states] || []).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Form.Select>
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
