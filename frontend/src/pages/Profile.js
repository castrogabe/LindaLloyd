import React, { useContext, useReducer, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';
import SkeletonProfile from '../components/skeletons/SkeletonProfile';

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
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ''
  );
  const [country, setCountry] = useState(shippingAddress.country || 'US');

  const [, dispatch] = useReducer(reducer, {});

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password || confirmPassword) {
      if (password.trim() !== confirmPassword.trim()) {
        toast.error('Passwords do not match');
        return;
      }
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
