import React from 'react';
import { useContext, useEffect } from 'react';
import { Store } from '../Store';
import { Row, Col, ListGroup } from 'react-bootstrap';

const Sidebar = ({ handleSidebarOpen }) => {
  const { state } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  useEffect(() => {
    if (cartItems.length > 0) {
      handleSidebarOpen(true);
      const timer = setTimeout(() => handleSidebarOpen(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [cartItems, handleSidebarOpen]);

  return (
    <div className='sidebar'>
      <Row>
        <Col>
          {cartItems.length > 0 && (
            <ListGroup>
              <h4 className='text-center'>Items In Cart</h4>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className='img-fluid rounded img-thumbnail'
                  />
                  <span>
                    <strong>{item.name}</strong> added to cart
                  </span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Sidebar;
