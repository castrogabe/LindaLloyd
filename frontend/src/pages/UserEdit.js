import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import SkeletonUserEdit from '../components/skeletons/SkeletonUserEdit';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
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

export default function UserEdit() {
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  const { state } = useContext(Store);
  const { userInfo } = state;
  const params = useParams();
  const { id: userId } = params;
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(''); // Added phone state
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingDelay, setLoadingDelay] = useState(true);
  const [carrier, setCarrier] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone || ''); // Fetch phone, default to empty string if missing
        setCarrier(data.carrier || '');
        setIsAdmin(data.isAdmin);
        setTimeout(() => {
          setLoadingDelay(false); // Set loadingDelay to false after the delay
        }, 2000); // Set the delay time here
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userId, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/users/${userId}`,
        { _id: userId, name, email, phone, carrier, isAdmin },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      ); // Include phone number in request
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      toast.success('User updated successfully');
      navigate('/admin/users');
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };

  return (
    <Container className='small-container'>
      <Helmet>
        <title>User Edit ${userId}</title>
      </Helmet>
      <br />
      <h4 className='box'>User Edit {userId}</h4>
      {(loadingDelay && <SkeletonUserEdit delay={1000} />) || (
        <>
          {loading ? (
            <SkeletonUserEdit delay={0} />
          ) : error ? (
            <MessageBox variant='danger'>{error}</MessageBox>
          ) : (
            <Form onSubmit={submitHandler}>
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
                  value={email}
                  type='email'
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className='mb-3' controlId='phone'>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type='text'
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Form.Group>

              <Form.Group className='mb-3' controlId='carrier'>
                <Form.Label>Phone Carrier for SMS</Form.Label>
                <Form.Select
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                >
                  <option value=''>Select Carrier</option>
                  <option value='vtext.com'>
                    Verizon / Spectrum Mobile (SMS)
                  </option>
                  <option value='vzwpix.com'>
                    Verizon / Spectrum Mobile (MMS)
                  </option>
                  <option value='txt.att.net'>AT&T</option>
                  <option value='tmomail.net'>T-Mobile</option>
                  <option value='messaging.sprintpcs.com'>Sprint</option>
                  <option value='vmobl.com'>Virgin Mobile</option>
                  <option value='messaging.nextel.com'>Nextel</option>
                  <option value='myboostmobile.com'>Boost Mobile</option>
                  <option value='mymetropcs.com'>MetroPCS</option>
                  <option value='text.republicwireless.com'>
                    Republic Wireless
                  </option>
                  <option value='textnow.me'>TextNow</option>
                </Form.Select>
              </Form.Group>

              <Form.Check
                className='mb-3'
                type='checkbox'
                id='isAdmin'
                label='isAdmin'
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />

              <div className='mb-3'>
                <Button disabled={loadingUpdate} type='submit'>
                  Update
                </Button>
                {loadingUpdate && <SkeletonUserEdit delay={1000} />}
              </div>
            </Form>
          )}
        </>
      )}
    </Container>
  );
}
