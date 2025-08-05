import React from 'react';
import MessageBox from './../MessageBox';

const ShippingAddressCard = ({
  shippingAddress,
  order, // Pass full order for invoice/flatRateShippingDetails
  requiresInvoiceOverall,
  hasFlatRateShippingOverall,
  invoiceItemsShipped,
  flatRateItemsShipped,
}) => {
  return (
    <div className='box mt-3'>
      <div className='body'>
        <h5 className='mb-3'>Shipping Address</h5>
        <div>
          {shippingAddress.fullName}
          <br />
          {shippingAddress.address}
          <br />
          {shippingAddress.city}, {shippingAddress.states}.{' '}
          {shippingAddress.postalCode}
          <br />
          {shippingAddress.country}
        </div>

        {/* Shipping Status MessageBox */}
        {order.isFullyShipped ? (
          <MessageBox variant='success'>All items shipped!</MessageBox>
        ) : (
          <MessageBox variant='info'>
            <p className='mb-1'>Current Shipping Status:</p>
            {requiresInvoiceOverall && (
              <div className='mb-1'>
                <strong>Invoice Items:</strong>{' '}
                {invoiceItemsShipped ? (
                  <span className='text-success'>
                    Shipped on{' '}
                    {new Date(
                      order.invoiceShippingDetails.shippedAt
                    ).toLocaleDateString()}
                  </span>
                ) : (
                  <span className='text-danger'>Pending Shipment</span>
                )}
              </div>
            )}
            {hasFlatRateShippingOverall && (
              <div className='mb-1'>
                <strong>Flat Rate/Included Items:</strong>{' '}
                {flatRateItemsShipped ? (
                  <span className='text-success'>
                    Shipped on{' '}
                    {new Date(
                      order.flatRateShippingDetails.shippedAt
                    ).toLocaleDateString()}
                  </span>
                ) : (
                  <span className='text-danger'>Pending Shipment</span>
                )}
              </div>
            )}
            {!requiresInvoiceOverall && !hasFlatRateShippingOverall && (
              <p className='mb-0'>
                No specific shipping methods applied to items.
              </p>
            )}
            {((requiresInvoiceOverall && !invoiceItemsShipped) ||
              (hasFlatRateShippingOverall && !flatRateItemsShipped)) && (
              <p className='mt-2 mb-0'>
                Some items are still pending shipment.
              </p>
            )}
          </MessageBox>
        )}

        {/* Invoice Shipping Details */}
        {order.invoiceShippingDetails?.isShipped && (
          <div className='mt-3'>
            <h6>Invoice Items Shipment Details:</h6>
            {order.orderItems
              .filter((item) => item.requiresShippingInvoice)
              .map((item) => (
                <div key={item._id} className='d-flex align-items-center mb-2'>
                  <img
                    src={item.image}
                    alt={item.name}
                    className='img-thumbnail me-2'
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'cover',
                    }}
                  />
                  <span>{item.name}</span>
                </div>
              ))}
            <p className='mb-1'>
              <strong>Delivery Days:</strong>{' '}
              {order.invoiceShippingDetails.deliveryDays}
            </p>
            <p className='mb-1'>
              <strong>Carrier:</strong>{' '}
              {order.invoiceShippingDetails.carrierName}
            </p>
            <p className='mb-0'>
              <strong>Tracking Number:</strong>{' '}
              {order.invoiceShippingDetails.trackingNumber}
            </p>
            <p>
              <small>
                Shipped On:{' '}
                {new Date(
                  order.invoiceShippingDetails.shippedAt
                ).toLocaleString()}
              </small>
            </p>
          </div>
        )}

        <hr />

        {/* Flat Rate Shipping Details */}
        {order.flatRateShippingDetails?.isShipped && (
          <div className='mt-3'>
            <h6>Flat Rate/Included Items Shipment Details:</h6>
            {order.orderItems
              .filter(
                (item) =>
                  item.useFlatRateShipping ||
                  (item.shippingCharge > 0 && !item.requiresShippingInvoice)
              )
              .map((item) => (
                <div key={item._id} className='d-flex align-items-center mb-2'>
                  <img
                    src={item.image}
                    alt={item.name}
                    className='img-thumbnail me-2'
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'cover',
                    }}
                  />
                  <span>{item.name}</span>
                </div>
              ))}
            <p className='mb-1'>
              <strong>Delivery Days:</strong>{' '}
              {order.flatRateShippingDetails.deliveryDays}
            </p>
            <p className='mb-1'>
              <strong>Carrier:</strong>{' '}
              {order.flatRateShippingDetails.carrierName}
            </p>
            <p className='mb-0'>
              <strong>Tracking Number:</strong>{' '}
              {order.flatRateShippingDetails.trackingNumber}
            </p>
            <p>
              <small>
                Shipped On:{' '}
                {new Date(
                  order.flatRateShippingDetails.shippedAt
                ).toLocaleString()}
              </small>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShippingAddressCard;
