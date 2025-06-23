import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { toast } from 'react-toastify';
import { Button, Table, Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import AdminPagination from '../components/AdminPagination';
import SkeletonOrderList from '../components/skeletons/SkeletonOrderList';
import { utils, writeFile } from 'xlsx';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        orders: action.payload.orders,
        totalOrders: action.payload.totalOrders,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

export default function OrderList() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [
    { loading, error, orders, totalOrders, pages, successDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
    orders: [],
    totalOrders: 0,
    pages: 0,
    successDelete: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/orders/admin?page=${page}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete]);

  const deleteHandler = async (order) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`/api/orders/${order._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('Order deleted successfully', {
          autoClose: 1000,
        });
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        toast.error(getError(err));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };

  // Function to format date (MM-DD-YYYY)
  function formatDate(dateString) {
    const dateObject = new Date(dateString);
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');
    const year = dateObject.getFullYear();
    return `${month}-${day}-${year}`;
  }

  const exportToExcel = () => {
    const data = orders.map((order) => ({
      ID: order._id,
      Product: order.orderItems.map((item) => item.name).join(', '),
      Quantity: order.orderItems.reduce(
        (total, item) => total + item.quantity,
        0
      ),
      OrderPrice: order.itemsPrice,
      ShippingCost: order.shippingPrice,
      Tax: order.taxPrice,
      Total: order.totalPrice.toFixed(2),
      User: order.user ? order.user.name : 'DELETED USER',
      Email: order.user ? order.user.email : '',
      Address: order.shippingAddress
        ? `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.states}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.county}, ${order.shippingAddress.country}`
        : '',
      Date: formatDate(order.createdAt),
      PaidAt: order.isPaid ? formatDate(order.paidAt) : 'No',
      Paid: order.isPaid ? 'Yes' : 'No',
      PaymentMethod: order.paymentMethod,
      ShippedDate: formatDate(order.shippedAt),
      DeliveryDays: order.deliveryDays,
      CarrierName: order.carrierName,
      TrackingNumber: order.trackingNumber,
    }));

    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Orders');
    writeFile(workbook, 'Orders.xlsx');
  };

  return (
    <div className='content'>
      <Helmet>
        <title>Order List</title>
      </Helmet>
      <br />
      <h4 className='box'>
        Order List Page (
        {totalOrders !== undefined ? totalOrders : 'Loading...'} )
      </h4>
      <div className='box'>
        <Button variant='primary' onClick={exportToExcel}>
          Download as Excel
        </Button>
        <br />
        <br />
        {loading ? (
          <Row>
            {[...Array(8).keys()].map((i) => (
              <Col key={i} md={12} className='mb-3'>
                <SkeletonOrderList />
              </Col>
            ))}
          </Row>
        ) : error ? (
          <MessageBox variant='danger'>{error}</MessageBox>
        ) : (
          <Table responsive striped bordered className='noWrap'>
            <thead className='thead'>
              <tr>
                <th>ID / PRODUCT</th>
                <th>USER</th>
                <th>DATE</th>
                <th>ORDER PRICE</th>
                <th>SHIPPING COST</th>
                <th>TAX</th>
                <th>TOTAL</th>
                <th>QTY</th>
                <th>PAID</th>
                <th>SHIPPED DATE</th>
                <th>DELIVERY DAYS</th>
                <th>CARRIER NAME</th>
                <th>TRACKING NUMBER</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    {order._id}{' '}
                    {order.orderItems.map((item) => (
                      <div key={item._id}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className='img-fluid rounded img-thumbnail'
                        />
                        <br />
                        <Link className='link' to={`/product/${item.slug}`}>
                          {item.name}
                        </Link>
                      </div>
                    ))}
                  </td>
                  <td>
                    <div>
                      <strong>Name:</strong>{' '}
                      {order.user ? order.user.name : 'DELETED USER'}
                    </div>
                    {order.user && (
                      <>
                        <div>
                          <strong>Email:</strong> {order.user.email}
                        </div>
                        <div>
                          <strong>Address:</strong> <br />
                          {order.shippingAddress.address} <br />
                          {order.shippingAddress.city},{' '}
                          {order.shippingAddress.states},{' '}
                          {order.shippingAddress.postalCode} <br />
                          {order.shippingAddress.country}
                        </div>
                      </>
                    )}
                  </td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{order.itemsPrice.toFixed(2)}</td>
                  <td>{order.shippingPrice.toFixed(2)}</td>
                  <td>{order.taxPrice.toFixed(2)}</td>
                  <td>{order.totalPrice.toFixed(2)}</td>
                  <td>
                    {order.orderItems.reduce(
                      (total, item) => total + item.quantity,
                      0
                    )}
                  </td>
                  <td>
                    {order.isPaid ? formatDate(order.paidAt) : 'No'}
                    <br />
                    {order.paymentMethod}
                  </td>
                  <td>{formatDate(order.shippedAt)}</td>
                  <td>{order.deliveryDays}</td>
                  <td>{order.carrierName}</td>
                  <td>{order.trackingNumber}</td>
                  <td>
                    <Button
                      type='button'
                      variant='primary'
                      onClick={() => {
                        navigate(`/order/${order._id}`);
                      }}
                    >
                      Details
                    </Button>
                    &nbsp;
                    <Button
                      type='button'
                      variant='primary'
                      onClick={() => deleteHandler(order)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      {/* Admin Pagination */}
      <AdminPagination
        currentPage={page}
        totalPages={pages}
        isAdmin={true} // or false based on whether it's admin or not
        keyword='OrderList' // Specify the keyword for OrderList pagination
      />

      <br />
    </div>
  );
}
