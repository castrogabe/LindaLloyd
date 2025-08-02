import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Table, Row, Col, Form } from 'react-bootstrap';
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
  const [selectedMonth, setSelectedMonth] = useState('');
  const [availableMonths, setAvailableMonths] = useState([]);
  const [loadingResendKey, setLoadingResendKey] = useState(null);

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

        const months = Array.from(
          new Set(
            data.orders.map((order) => {
              const date = new Date(order.createdAt);
              return `${date.getFullYear()}-${String(
                date.getMonth() + 1
              ).padStart(2, '0')}`;
            })
          )
        ).sort((a, b) => (a < b ? 1 : -1));
        setAvailableMonths(months);
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
    if (!dateString) return ''; // return empty string if date is null or undefined
    const dateObject = new Date(dateString);
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');
    const year = dateObject.getFullYear();
    return `${month}-${day}-${year}`;
  }

  const exportToExcel = () => {
    const filteredOrders = selectedMonth
      ? orders.filter((order) => {
          const date = new Date(order.createdAt);
          const month = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, '0')}`;
          return month === selectedMonth;
        })
      : orders;

    // --- UPDATED EXCEL EXPORT LOGIC ---
    const data = filteredOrders.flatMap((order) => {
      const baseData = {
        ID: order._id,
        OrderPrice: order.itemsPrice,
        Tax: order.taxPrice,
        Total: order.totalPrice.toFixed(2),
        User: order.user ? order.user.name : 'DELETED USER',
        Email: order.user ? order.user.email : '',
        Address: order.shippingAddress
          ? `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.states}, ${order.shippingAddress.postalCode},  ${order.shippingAddress.country}`
          : '',
        Date: formatDate(order.createdAt),
        PaidAt: order.isPaid ? formatDate(order.paidAt) : 'No',
        Paid: order.isPaid ? 'Yes' : 'No',
        PaymentMethod: order.paymentMethod,
      };

      const rows = [];

      // Add row for Invoice Shipping Details if applicable
      if (order.invoiceShippingDetails?.isShipped) {
        rows.push({
          ...baseData,
          Product: order.orderItems
            .filter((item) => item.requiresShippingInvoice)
            .map((item) => item.name)
            .join(', '),
          Quantity: order.orderItems
            .filter((item) => item.requiresShippingInvoice)
            .reduce((total, item) => total + item.quantity, 0),
          ShippingCost: order.separateShippingPrice, // Use separateShippingPrice for invoice part
          ShippedDate: formatDate(order.invoiceShippingDetails.shippedAt),
          DeliveryDays: order.invoiceShippingDetails.deliveryDays,
          CarrierName: order.invoiceShippingDetails.carrierName,
          TrackingNumber: order.invoiceShippingDetails.trackingNumber,
          ShippingType: 'Invoiced Items',
        });
      }

      // Add row for Flat Rate Shipping Details if applicable
      if (order.flatRateShippingDetails?.isShipped) {
        rows.push({
          ...baseData,
          Product: order.orderItems
            .filter(
              (item) =>
                item.useFlatRateShipping ||
                (item.shippingCharge > 0 && !item.requiresShippingInvoice)
            )
            .map((item) => item.name)
            .join(', '),
          Quantity: order.orderItems
            .filter(
              (item) =>
                item.useFlatRateShipping ||
                (item.shippingCharge > 0 && !item.requiresShippingInvoice)
            )
            .reduce((total, item) => total + item.quantity, 0),
          ShippingCost: order.orderItems
            .filter(
              (item) =>
                item.useFlatRateShipping ||
                (item.shippingCharge > 0 && !item.requiresShippingInvoice)
            )
            .reduce((total, item) => total + item.shippingCharge, 0), // Sum flat rate charges for these items
          ShippedDate: formatDate(order.flatRateShippingDetails.shippedAt),
          DeliveryDays: order.flatRateShippingDetails.deliveryDays,
          CarrierName: order.flatRateShippingDetails.carrierName,
          TrackingNumber: order.flatRateShippingDetails.trackingNumber,
          ShippingType: 'Flat Rate Items',
        });
      }

      // If neither is shipped but the order exists, include a row for the overall order
      if (
        !order.invoiceShippingDetails?.isShipped &&
        !order.flatRateShippingDetails?.isShipped
      ) {
        rows.push({
          ...baseData,
          Product: order.orderItems.map((item) => item.name).join(', '),
          Quantity: order.orderItems.reduce(
            (total, item) => total + item.quantity,
            0
          ),
          ShippingCost: order.shippingPrice, // Overall shipping price
          ShippedDate: 'Not Shipped',
          DeliveryDays: '',
          CarrierName: '',
          TrackingNumber: '',
          ShippingType: 'Overall Order (Not Shipped)',
        });
      } else if (
        rows.length === 0 &&
        (order.invoiceShippingDetails || order.flatRateShippingDetails)
      ) {
        // Fallback for cases where shipping details exist but aren't marked shipped yet
        rows.push({
          ...baseData,
          Product: order.orderItems.map((item) => item.name).join(', '),
          Quantity: order.orderItems.reduce(
            (total, item) => total + item.quantity,
            0
          ),
          ShippingCost: order.shippingPrice,
          ShippedDate: 'Pending Shipment',
          DeliveryDays: '',
          CarrierName: '',
          TrackingNumber: '',
          ShippingType: 'Overall Order (Pending)',
        });
      }

      return rows;
    });
    // --- END UPDATED EXCEL EXPORT LOGIC ---

    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Orders');
    writeFile(workbook, 'Orders.xlsx');
  };

  const handleResendPurchaseConfirmation = async (orderId) => {
    const key = `${orderId}-purchase`;
    try {
      setLoadingResendKey(key);
      await axios.put(
        `/api/orders/${orderId}/resend-purchase-confirmation`,
        {},
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      toast.success('Purchase confirmation email resent');
    } catch (err) {
      toast.error(getError(err));
    } finally {
      setLoadingResendKey(null);
    }
  };

  const handleResendInvoiceShipping = async (orderId) => {
    const key = `${orderId}-invoice`;
    try {
      setLoadingResendKey(key);
      await axios.put(
        `/api/orders/${orderId}/resend-invoice-shipping`,
        {},
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      toast.success('Invoice shipping confirmation email resent');
    } catch (err) {
      toast.error(getError(err));
    } finally {
      setLoadingResendKey(null);
    }
  };

  const handleResendFlatRateShipping = async (orderId) => {
    const key = `${orderId}-flatRate`;
    try {
      setLoadingResendKey(key);
      await axios.put(
        `/api/orders/${orderId}/resend-flat-rate-shipping`,
        {},
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      toast.success('Flat rate shipping confirmation email resent');
    } catch (err) {
      toast.error(getError(err));
    } finally {
      setLoadingResendKey(null);
    }
  };

  return (
    <div className='content'>
      <Helmet>
        <title>Order List</title>
      </Helmet>
      <br />
      <h4 className='box'>
        Order List Page (
        {totalOrders !== undefined ? totalOrders : 'Loading...'})
      </h4>
      <div className='box'>
        <Row className='mb-3'>
          <Col md={4}>
            <Form.Select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value=''>-- Filter by Month --</option>
              {availableMonths.map((monthYear) => {
                const [year, month] = monthYear.split('-');
                const date = new Date(`${month}/01/${year}`);
                const formatted = date.toLocaleString('default', {
                  month: 'long',
                  year: 'numeric',
                });
                return (
                  <option key={monthYear} value={monthYear}>
                    {formatted}
                  </option>
                );
              })}
            </Form.Select>
          </Col>
          <Col md={4}>
            <Button variant='primary' onClick={exportToExcel}>
              Download as Excel
            </Button>
          </Col>
        </Row>
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
                <th>SHIPPING INFO</th>
                <th>TAX</th>
                <th>TOTAL</th>
                <th>QTY</th>
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

                  <td>
                    {/* Display shipping info for each item group */}
                    {order.orderItems.map((item) => {
                      if (item.requiresShippingInvoice) {
                        return (
                          <div
                            key={`${item._id}-invoice-info`}
                            style={{ marginBottom: '8px' }}
                          >
                            <strong>{item.name}</strong>
                            <br />
                            <small className='text-muted'>
                              Separate Shipping Invoice
                              <br />
                              Shipping Paid: $
                              {order.separateShippingPrice
                                ? order.separateShippingPrice.toFixed(2)
                                : 'N/A'}{' '}
                              on{' '}
                              {order.shippingPaidAt
                                ? formatDate(order.shippingPaidAt)
                                : 'N/A'}
                            </small>
                          </div>
                        );
                      } else if (
                        item.useFlatRateShipping ||
                        (item.shippingCharge &&
                          item.shippingCharge > 0 &&
                          !item.requiresShippingInvoice)
                      ) {
                        return (
                          <div
                            key={`${item._id}-flatrate-info`}
                            style={{ marginBottom: '8px' }}
                          >
                            <strong>{item.name}</strong>
                            <br />
                            <small className='text-muted'>
                              Flat Rate Shipping: $
                              {item.shippingCharge
                                ? item.shippingCharge.toFixed(2)
                                : 'N/A'}
                            </small>
                          </div>
                        );
                      } else {
                        return (
                          <div
                            key={`${item._id}-free-info`}
                            style={{ marginBottom: '8px' }}
                          >
                            <strong>{item.name}</strong>
                            <br />
                            <small className='text-muted'>
                              Free Shipping Included
                            </small>
                          </div>
                        );
                      }
                    })}
                  </td>

                  <td>{order.taxPrice.toFixed(2)}</td>
                  <td>{order.totalPrice.toFixed(2)}</td>
                  <td>
                    This Order Items:{' '}
                    {order.orderItems.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    )}{' '}
                    {/* Corrected to sum current order items */}
                    <br />
                    {/* The "All Orders Items Sold" calculation is incorrect here as 'orders' is paginated.
                        It should be calculated from a full dataset or a separate API call.
                        Keeping it as is for now, but note for future.
                    */}
                    All Orders Items Sold:{' '}
                    {orders.reduce(
                      (sum, o) =>
                        sum +
                        o.orderItems.reduce(
                          (qty, item) => qty + item.quantity,
                          0
                        ),
                      0
                    )}
                  </td>
                  {/* --- NEW: Display Shipped Date, Delivery Days, Carrier Name, Tracking Number for each group --- */}
                  <td>
                    {order.invoiceShippingDetails?.isShipped && (
                      <div style={{ marginBottom: '8px' }}>
                        <strong>Invoiced:</strong>
                        <br />
                        {formatDate(order.invoiceShippingDetails.shippedAt)}
                      </div>
                    )}
                    {order.flatRateShippingDetails?.isShipped && (
                      <div style={{ marginBottom: '8px' }}>
                        <strong>Flat Rate:</strong>
                        <br />
                        {formatDate(order.flatRateShippingDetails.shippedAt)}
                      </div>
                    )}
                    {!order.isFullyShipped && (
                      <div style={{ marginBottom: '8px' }}>Not Shipped</div>
                    )}
                  </td>
                  <td>
                    {order.invoiceShippingDetails?.isShipped && (
                      <div style={{ marginBottom: '8px' }}>
                        <strong>Invoiced:</strong>
                        <br />
                        {order.invoiceShippingDetails.deliveryDays}
                      </div>
                    )}
                    {order.flatRateShippingDetails?.isShipped && (
                      <div style={{ marginBottom: '8px' }}>
                        <strong>Flat Rate:</strong>
                        <br />
                        {order.flatRateShippingDetails.deliveryDays}
                      </div>
                    )}
                  </td>
                  <td>
                    {order.invoiceShippingDetails?.isShipped && (
                      <div style={{ marginBottom: '8px' }}>
                        <strong>Invoiced:</strong>
                        <br />
                        {order.invoiceShippingDetails.carrierName}
                      </div>
                    )}
                    {order.flatRateShippingDetails?.isShipped && (
                      <div style={{ marginBottom: '8px' }}>
                        <strong>Flat Rate:</strong>
                        <br />
                        {order.flatRateShippingDetails.carrierName}
                      </div>
                    )}
                  </td>
                  <td>
                    {order.invoiceShippingDetails?.isShipped && (
                      <div style={{ marginBottom: '8px' }}>
                        <strong>Invoiced:</strong>
                        <br />
                        {order.invoiceShippingDetails.trackingNumber}
                      </div>
                    )}
                    {order.flatRateShippingDetails?.isShipped && (
                      <div style={{ marginBottom: '8px' }}>
                        <strong>Flat Rate:</strong>
                        <br />
                        {order.flatRateShippingDetails.trackingNumber}
                      </div>
                    )}
                  </td>
                  {/* --- END NEW DISPLAY LOGIC --- */}
                  <td>
                    <Button
                      variant='primary'
                      size='sm'
                      onClick={() => navigate(`/order/${order._id}`)}
                    >
                      Details
                    </Button>
                    &nbsp;
                    <Button
                      variant='danger'
                      size='sm'
                      onClick={() => deleteHandler(order)}
                    >
                      Delete
                    </Button>
                    <br />
                    <Button
                      variant='info'
                      size='sm'
                      disabled={loadingResendKey === `${order._id}-purchase`}
                      onClick={() =>
                        handleResendPurchaseConfirmation(order._id)
                      }
                    >
                      {loadingResendKey === `${order._id}-purchase`
                        ? 'Sending...'
                        : 'Resend Purchase Confirmation Email'}
                    </Button>
                    <br />
                    {order.invoiceShippingDetails?.isShipped && (
                      <Button
                        variant='info'
                        size='sm'
                        disabled={loadingResendKey === `${order._id}-invoice`}
                        onClick={() => handleResendInvoiceShipping(order._id)}
                      >
                        {loadingResendKey === `${order._id}-invoice`
                          ? 'Sending...'
                          : 'Resend Invoiced Shipping Email'}
                      </Button>
                    )}
                    <br />
                    {order.flatRateShippingDetails?.isShipped && (
                      <Button
                        variant='info'
                        size='sm'
                        disabled={loadingResendKey === `${order._id}-flatRate`}
                        onClick={() => handleResendFlatRateShipping(order._id)}
                      >
                        {loadingResendKey === `${order._id}-flatRate`
                          ? 'Sending...'
                          : 'Resend Flat Rate Shipping Email'}
                      </Button>
                    )}
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
