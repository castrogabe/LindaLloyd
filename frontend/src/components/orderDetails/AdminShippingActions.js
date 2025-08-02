// src/components/orderDetails/AdminShippingActions.js
import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import AdminShippingForm from './AdminShippingForm'; // Corrected path // The reusable form component (adjust path if needed)

const AdminShippingActions = ({
  order,
  userInfo,
  requiresInvoiceOverall,
  hasFlatRateShippingOverall,
  invoiceSent,
  invoicePaid,
  invoiceItemsShipped,
  flatRateItemsShipped,
  mixedShippingMethods,
  shippingPrice, // from parent
  setShippingPrice, // from parent
  sendingInvoice, // from parent
  handleSendShippingInvoice, // from parent
  invoiceDeliveryDays,
  setInvoiceDeliveryDays,
  invoiceCarrierName,
  setInvoiceCarrierName,
  invoiceTrackingNumber,
  setInvoiceTrackingNumber,
  handleMarkInvoiceItemsShipped,
  flatRateDeliveryDays,
  setFlatRateDeliveryDays,
  flatRateCarrierName,
  setFlatRateCarrierName,
  flatRateTrackingNumber,
  setFlatRateTrackingNumber,
  handleMarkFlatRateItemsShipped,
  loading, // Overall loading from parent
}) => {
  // Internal state for toggling forms in mixed scenarios
  const [showInvoiceFormOption, setShowInvoiceFormOption] = useState(false);
  const [showPrepaidFormOption, setShowPrepaidFormOption] = useState(false);

  const itemsRequiringInvoice =
    order?.orderItems?.filter((item) => item.requiresShippingInvoice) || [];
  const itemsWithFlatRateShipping =
    order?.orderItems?.filter(
      (item) =>
        item.useFlatRateShipping ||
        (item.shippingCharge > 0 && !item.requiresShippingInvoice)
    ) || [];

  // Conditions to determine if the *options* should be visible to the admin
  const canSendInvoice =
    userInfo?.isAdmin &&
    order?.isPaid &&
    requiresInvoiceOverall &&
    !invoiceSent;
  const canPreparePrepaidShipping =
    userInfo?.isAdmin &&
    order?.isPaid &&
    hasFlatRateShippingOverall &&
    !flatRateItemsShipped;
  const canPrepareInvoiceShipping =
    userInfo?.isAdmin &&
    order?.isPaid &&
    requiresInvoiceOverall &&
    invoiceSent &&
    invoicePaid &&
    !invoiceItemsShipped;

  // Effect for auto-selection of forms based on order state (from your original code)
  useEffect(() => {
    if (order && userInfo?.isAdmin) {
      if (mixedShippingMethods) {
        setShowInvoiceFormOption(false);
        setShowPrepaidFormOption(false);
      } else {
        if (canPrepareInvoiceShipping || canSendInvoice) {
          setShowInvoiceFormOption(true);
          setShowPrepaidFormOption(false);
        } else if (canPreparePrepaidShipping) {
          setShowPrepaidFormOption(true);
          setShowInvoiceFormOption(false);
        }
      }
    }
  }, [
    order,
    userInfo,
    mixedShippingMethods,
    canPrepareInvoiceShipping,
    canPreparePrepaidShipping,
    canSendInvoice,
  ]);

  return (
    <div className='box mt-3'>
      {' '}
      {/* Changed from ListGroup.Item to div for consistent box styling */}
      <h5 className='mb-3'>Admin Shipping Actions</h5>{' '}
      {/* Use h5 for consistency */}
      {/* Admin form to send shipping invoice (if applicable and not sent) */}
      {canSendInvoice && (
        <div className='mt-3 mb-3'>
          {' '}
          {/* Removed inner 'box' as this component already has it */}
          <h6 className='text-center mb-3'>Send Shipping Invoice</h6>
          <Form onSubmit={handleSendShippingInvoice}>
            <Form.Group className='mb-2' controlId='shippingPrice'>
              <Form.Label>Shipping Price (Invoice)</Form.Label>
              <Form.Control
                type='number'
                step='0.01'
                value={shippingPrice}
                onChange={(e) => setShippingPrice(e.target.value)}
                required
              />
            </Form.Group>
            <Button
              type='submit'
              variant='primary'
              className='w-100'
              disabled={sendingInvoice}
            >
              {sendingInvoice ? 'Sending...' : 'Send Shipping Invoice'}
            </Button>
          </Form>
        </div>
      )}
      {/* Forms for Marking as Shipped */}
      {mixedShippingMethods && (
        <div className='mt-3 mb-3'>
          {' '}
          {/* Removed inner 'box' as this component already has it */}
          <h6 className='text-center mb-3'>Select Shipping Action</h6>
          {/* Checkbox for Invoice Items (if not yet shipped and applicable) */}
          {!invoiceItemsShipped && canPrepareInvoiceShipping && (
            <div className='mb-3'>
              <Form.Check
                type='checkbox'
                id='toggleInvoiceForm'
                checked={showInvoiceFormOption}
                onChange={(e) => {
                  setShowInvoiceFormOption(e.target.checked);
                  if (e.target.checked) setShowPrepaidFormOption(false);
                }}
                label={
                  <div style={{ color: '#333', fontWeight: 'bold' }}>
                    Handle Shipping Invoice ({itemsRequiringInvoice.length} item
                    {itemsRequiringInvoice.length !== 1 ? 's' : ''})
                    {itemsRequiringInvoice.map((item) => (
                      <span key={item._id} className='ms-2'>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                          }}
                          className='rounded me-1'
                        />
                        {item.name}
                      </span>
                    ))}
                  </div>
                }
              />
            </div>
          )}
          {/* Checkbox for Flat Rate/Included Items (if not yet shipped and applicable) */}
          {!flatRateItemsShipped && canPreparePrepaidShipping && (
            <div className='mb-3'>
              <Form.Check
                type='checkbox'
                id='togglePrepaidForm'
                checked={showPrepaidFormOption}
                onChange={(e) => {
                  setShowPrepaidFormOption(e.target.checked);
                  if (e.target.checked) setShowInvoiceFormOption(false);
                }}
                label={
                  <div style={{ color: '#333', fontWeight: 'bold' }}>
                    Prepare Flat Rate/Included Shipment (
                    {itemsWithFlatRateShipping.length} item
                    {itemsWithFlatRateShipping.length !== 1 ? 's' : ''})
                    {itemsWithFlatRateShipping.map((item) => (
                      <span key={item._id} className='ms-2'>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                          }}
                          className='rounded me-1'
                        />
                        {item.name}
                      </span>
                    ))}
                  </div>
                }
              />
            </div>
          )}
        </div>
      )}
      {/* Render Invoice Shipping Form */}
      {(showInvoiceFormOption ||
        (canPrepareInvoiceShipping && !mixedShippingMethods)) && (
        <AdminShippingForm
          title='Mark Invoice-Shipped Items as Shipped'
          items={itemsRequiringInvoice}
          deliveryDays={invoiceDeliveryDays}
          setDeliveryDays={setInvoiceDeliveryDays}
          carrierName={invoiceCarrierName}
          setCarrierName={setInvoiceCarrierName}
          trackingNumber={invoiceTrackingNumber}
          setTrackingNumber={setInvoiceTrackingNumber}
          loadingShipped={loading}
          submitHandler={handleMarkInvoiceItemsShipped}
        />
      )}
      {/* Render Flat Rate Shipping Form */}
      {(showPrepaidFormOption ||
        (canPreparePrepaidShipping && !mixedShippingMethods)) && (
        <AdminShippingForm
          title='Prepare Flat Rate/Included Shipment'
          items={itemsWithFlatRateShipping}
          deliveryDays={flatRateDeliveryDays}
          setDeliveryDays={setFlatRateDeliveryDays}
          carrierName={flatRateCarrierName}
          setCarrierName={setFlatRateCarrierName}
          trackingNumber={flatRateTrackingNumber}
          setTrackingNumber={setFlatRateTrackingNumber}
          loadingShipped={loading}
          submitHandler={handleMarkFlatRateItemsShipped}
        />
      )}
    </div> // Closing div for AdminShippingActions box
  );
};

export default AdminShippingActions;
