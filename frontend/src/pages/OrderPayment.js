import React, { useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import SkeletonOrderDetails from '../components/skeletons/SkeletonOrderDetails';
import MessageBox from '../components/MessageBox';
import SquareCheckout from '../components/SquareCheckout';
import CheckoutSteps from '../components/CheckoutSteps';
import { getError } from '../utils';
import { useContext } from 'react';
import { Store } from '../Store';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function OrderPayment() {
  const { id: orderId } = useParams();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, order, error }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    fetchOrder();
  }, [orderId, userInfo]);

  const handleSuccess = async (paymentResult) => {
    try {
      await axios.put(`/api/orders/${orderId}/pay`, paymentResult, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      window.location.href = `/order/${orderId}`; // redirect to final OrderDetails
    } catch (err) {
      console.error(getError(err));
      alert('Failed to update payment status');
    }
  };

  return loading ? (
    <SkeletonOrderDetails />
  ) : error ? (
    <>
      <MessageBox variant='danger'>{error}</MessageBox>
    </>
  ) : (
    <div className='content'>
      <br />
      <CheckoutSteps step1 step2 step3 step4 />
      <br />
      <Helmet>
        <title>Order Payment</title>
      </Helmet>
      <div className='container small-container'>
        <h4 className='box'>
          <i
            className='fas fa-credit-card'
            style={{ color: 'green', marginRight: '10px' }}
          ></i>
          Complete Payment for Order {orderId}
        </h4>
        <SquareCheckout
          orderId={orderId}
          totalPrice={order.totalPrice}
          userInfo={userInfo}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}

// step 1 (Cart)
// step 2 (ShippingAddress)
// step 3 (PlaceOrder)
// step 4 (OrderPayment) <= CURRENT STEP (sandbox Square testing No: 4111 1111 1111 1111  any future date  cvv-111 zip-1111)
// lands on OrderDetails for payment
