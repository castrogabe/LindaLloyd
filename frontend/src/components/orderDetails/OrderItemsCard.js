import React from 'react';
import { ListGroup, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const OrderItemsCard = ({ orderItems }) => {
  return (
    <div className='box'>
      <div className='body'>
        <h5 className='mb-3'>Items</h5> {/* Use h5 for consistency */}
        <ListGroup variant='flush'>
          {orderItems && orderItems.length > 0 ? (
            orderItems.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row className='align-items-center'>
                  <Col md={6}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className='img-fluid rounded img-thumbnail'
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        marginRight: '10px',
                      }}
                    />
                    <Link className='link' to={`/product/${item.slug}`}>
                      {item.name}
                    </Link>
                    <br />
                    {item.requiresShippingInvoice ? (
                      <small style={{ color: 'green' }}>
                        Shipping Invoiced After Purchase
                      </small>
                    ) : item.useFlatRateShipping || item.shippingCharge > 0 ? (
                      <small style={{ color: 'gray' }}>
                        Flat Rate: ${item.shippingCharge.toFixed(2)}
                      </small>
                    ) : (
                      <small style={{ color: 'green' }}>
                        Free Shipping Included
                      </small>
                    )}
                  </Col>
                  <Col md={3}>Qty: {item.quantity}</Col>
                  <Col md={3}>${(item.salePrice || item.price).toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
            ))
          ) : (
            <ListGroup.Item>No items found in this order.</ListGroup.Item>
          )}
        </ListGroup>
      </div>
    </div>
  );
};

export default OrderItemsCard;
