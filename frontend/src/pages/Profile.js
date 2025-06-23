import React, { useContext, useReducer, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';
import SkeletonProfile from '../components/skeletons/SkeletonProfile';
import { stateCountyMap } from '../helpers/stateCountyMap';

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

export default function Profile() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const navigate = useNavigate();
  const { userInfo } = state;

  // console.log('🔍 Profile userInfo:', userInfo);
  // console.log('📦 Profile shippingAddress:', userInfo.shippingAddress);

  const shippingAddress =
    userInfo.shippingAddress ||
    JSON.parse(localStorage.getItem('shippingAddress')) ||
    {};

  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showForm, setShowForm] = useState(!shippingAddress?.address);

  const [fullName, setFullName] = useState(shippingAddress.fullName || '');
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [states, setStates] = useState(shippingAddress.states || '');
  const [county, setCounty] = useState(shippingAddress.county || '');
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ''
  );
  const [country, setCountry] = useState(shippingAddress.country || 'USA');

  const [, dispatch] = useReducer(reducer, {});

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      const { data } = await axios.put(
        '/api/users/profile',
        {
          name,
          email,
          password,
          shippingAddress: {
            fullName,
            address,
            city,
            states,
            county,
            postalCode,
            country,
          },
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({ type: 'UPDATE_SUCCESS' });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('Profile updated successfully', { autoClose: 1000 });
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL' });
      toast.error(getError(err));
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='container'>
      <br />
      {isLoading ? (
        <SkeletonProfile />
      ) : (
        <>
          <Helmet>
            <title>User Profile</title>
          </Helmet>
          <h4 className='box'>User Profile</h4>
          <Form onSubmit={submitHandler}>
            <Row>
              {/* LEFT COLUMN */}
              <Col md={6}>
                <Form.Group className='mb-3' controlId='name'>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className='mb-3' controlId='email'>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className='mb-3' controlId='password'>
                  <Form.Label>New Password</Form.Label>
                  <div className='input-group'>
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      placeholder='••••••••'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                      variant='outline-secondary'
                      onClick={togglePasswordVisibility}
                    >
                      <i
                        className={`fa ${
                          showPassword ? 'fa-eye-slash' : 'fa-eye'
                        }`}
                      />
                    </Button>
                  </div>
                </Form.Group>

                <Form.Group className='mb-3' controlId='confirmPassword'>
                  <Form.Label>Confirm New Password</Form.Label>
                  <div className='input-group'>
                    <Form.Control
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder='••••••••'
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button
                      variant='outline-secondary'
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      <i
                        className={`fa ${
                          showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'
                        }`}
                      />
                    </Button>
                  </div>
                </Form.Group>
              </Col>

              {/* RIGHT COLUMN */}
              <Col md={6}>
                <h5 className='box'>Shipping Address</h5>
                {!showForm && shippingAddress?.address ? (
                  <div className='saved-address-box'>
                    <p>
                      <strong>{shippingAddress.fullName}</strong>
                    </p>
                    <p>
                      {shippingAddress.address},<br />
                      {shippingAddress.city}, {shippingAddress.states},{' '}
                      {shippingAddress.postalCode},<br />
                      County: {shippingAddress.county},<br />
                      {shippingAddress.country}
                    </p>
                    <div className='mb-3'>
                      <Button
                        variant='primary'
                        onClick={() => navigate('/placeorder')}
                      >
                        Use This Address
                      </Button>{' '}
                      <Button
                        variant='secondary'
                        onClick={() => setShowForm(true)}
                      >
                        Enter New Address
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Form.Group className='mb-3' controlId='fullName'>
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className='mb-3' controlId='address'>
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className='mb-3' controlId='city'>
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
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
                      >
                        <option value=''>Select State</option>
                        {Object.keys(stateCountyMap).map((abbr) => (
                          <option key={abbr} value={abbr}>
                            {abbr}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className='mb-3' controlId='county'>
                      <Form.Label>County</Form.Label>
                      <Form.Select
                        value={county}
                        onChange={(e) => setCounty(e.target.value)}
                      >
                        <option value=''>Select County</option>
                        {(stateCountyMap[states] || []).map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className='mb-3' controlId='postalCode'>
                      <Form.Label>Postal Code</Form.Label>
                      <Form.Control
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className='mb-3' controlId='country'>
                      <Form.Label>Country</Form.Label>
                      <Form.Control
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                      />
                    </Form.Group>
                  </>
                )}
              </Col>
            </Row>

            <div className='mb-3 mt-3'>
              <Button type='submit'>Update Profile</Button>
            </div>
          </Form>
        </>
      )}
    </div>
  );
}
