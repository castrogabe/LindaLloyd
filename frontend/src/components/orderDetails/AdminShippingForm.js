// src/components/orderDetails/AdminShippingForm.js
import React from 'react'; // Make sure React is imported if you're using useState/useEffect in this file, otherwise just 'react' is fine
import { Form, Button } from 'react-bootstrap';

const AdminShippingForm = ({
  title,
  items,
  deliveryDays,
  setDeliveryDays,
  carrierName,
  setCarrierName,
  trackingNumber,
  setTrackingNumber,
  loadingShipped,
  submitHandler, // This is the prop that will receive the handler from parent
}) => {
  // Define a local onSubmit function that will prepare the data
  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent default browser form submission
    // Call the passed submitHandler with the collected form data
    submitHandler({
      deliveryDays: deliveryDays,
      carrierName: carrierName,
      trackingNumber: trackingNumber,
    });
  };

  return (
    <div className='box mt-3'>
      {items.length > 0 && (
        <div className='mb-3'>
          {items.map((item) => (
            <div
              key={item._id}
              className='d-flex align-items-center justify-content-center mb-2'
            >
              <img
                src={item.image}
                alt={item.name}
                className='img-thumbnail me-2'
                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
              />
              <strong>{item.name}</strong>
            </div>
          ))}
        </div>
      )}

      <h6 className='text-center mt-3'>{title}</h6>

      <Form onSubmit={handleFormSubmit}>
        {' '}
        {/* CHANGE HERE: Use local handler */}
        <Form.Group className='mb-3' controlId='days'>
          <Form.Label>Delivery Days</Form.Label>
          <Form.Control
            type='number' // ENSURE this is type='number' if you expect a number on backend
            value={deliveryDays}
            onChange={(e) => setDeliveryDays(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className='mb-2' controlId='carrierName'>
          <Form.Label>Carrier Name</Form.Label>
          <Form.Control
            type='text'
            value={carrierName}
            onChange={(e) => setCarrierName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className='mb-2' controlId='trackingNumber'>
          <Form.Label>Tracking Number</Form.Label>
          <Form.Control
            type='text'
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
          />
        </Form.Group>
        <Button
          type='submit'
          variant='primary'
          className='w-100 mt-2'
          disabled={loadingShipped}
        >
          {loadingShipped ? 'Processing...' : 'Mark as Shipped'}
        </Button>
      </Form>
    </div>
  );
};

export default AdminShippingForm;
