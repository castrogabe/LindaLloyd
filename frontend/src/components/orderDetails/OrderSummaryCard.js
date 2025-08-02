// src/components/orderDetails/OrderSummaryCard.js
import React from 'react';
import { ListGroup, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../../utils';

const OrderSummaryCard = ({
  order,
  requiresInvoiceOverall,
  hasFlatRateShippingOverall,
  invoiceSent,
  invoicePaid,
  invoiceItemsShipped,
  handleMarkShippingInvoicePaid,
  userInfo,
}) => {
  return (
    <div className='box'>
      <div className='body'>
        <h5 className='mb-3'>Order Summary</h5>
        <ListGroup variant='flush'>
          <ListGroup.Item>
            <Row>
              <Col>Items</Col>
              <Col>${order.itemsPrice.toFixed(2)}</Col>
            </Row>
          </ListGroup.Item>

          <ListGroup.Item>
            <Row>
              <Col>Shipping</Col>
              <Col>
                {order.shippingPrice > 0
                  ? `$${order.shippingPrice.toFixed(2)}`
                  : requiresInvoiceOverall && !invoiceSent
                  ? 'TBD (Invoice Pending)'
                  : hasFlatRateShippingOverall && !requiresInvoiceOverall
                  ? 'Included / Flat Rate'
                  : 'Free Shipping'}
              </Col>
            </Row>

            {/* Details for items requiring an invoice */}
            {requiresInvoiceOverall && (
              <div className='mt-2 ps-3'>
                <strong>Invoice Items:</strong>{' '}
                {/* Ensure the entire ternary results in a single string or JSX element */}
                {invoiceSent
                  ? invoicePaid
                    ? 'Paid'
                    : 'Awaiting Payment'
                  : 'Pending Invoice'}
                <br />
                {invoiceItemsShipped && (
                  <small className='text-success'>
                    Shipped on{' '}
                    {new Date(
                      order.invoiceShippingDetails.shippedAt
                    ).toLocaleString()}
                  </small>
                )}
                {!invoiceItemsShipped &&
                  invoiceSent &&
                  invoicePaid &&
                  userInfo?.isAdmin && (
                    <span className='text-warning ms-2'> (Ready to Ship)</span>
                  )}
                {invoiceSent &&
                  !invoicePaid &&
                  userInfo?.isAdmin &&
                  order.isPaid && (
                    <div className='mt-2'>
                      <p className='mb-0'>
                        <a
                          href={order.shippingInvoiceUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          View Paid Shipping Invoice
                        </a>
                      </p>
                      <Button
                        variant='success'
                        className='mt-2 w-100'
                        onClick={handleMarkShippingInvoicePaid} // Use passed handler
                      >
                        Mark Shipping Invoice as Paid
                      </Button>
                    </div>
                  )}
              </div>
            )}

            {/* Details for Flat Rate / Included items */}
            {hasFlatRateShippingOverall && (
              <div className='mt-2 ps-3'>
                <strong>Flat Rate/Included Items:</strong>{' '}
                {order.flatRateShippingDetails?.isShipped ? (
                  <span className='text-success'>Shipped</span>
                ) : (
                  <span className='text-warning'>Pending Shipment</span>
                )}
                <br />
                {order.orderItems.filter(
                  (item) => item.useFlatRateShipping || item.shippingCharge > 0
                ).length > 0 &&
                  order.orderItems
                    .filter(
                      (item) =>
                        item.useFlatRateShipping || item.shippingCharge > 0
                    )
                    .map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          fontSize: '0.85em',
                          color: '#666',
                          paddingLeft: '1rem',
                        }}
                      >
                        {item.name}: ${item.shippingCharge.toFixed(2)} ×{' '}
                        {item.quantity}
                      </div>
                    ))}
              </div>
            )}
          </ListGroup.Item>

          <ListGroup.Item>
            <Row>
              <Col>Tax</Col>
              <Col>${order.taxPrice.toFixed(2)}</Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col>
                <strong>Total</strong>
              </Col>
              <Col>
                <strong>${order.totalPrice.toFixed(2)}</strong>
              </Col>
            </Row>
          </ListGroup.Item>
        </ListGroup>
      </div>
    </div>
  );
};

export default OrderSummaryCard;
