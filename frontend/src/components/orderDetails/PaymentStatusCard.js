import React from 'react';
import MessageBox from './../MessageBox';

const PaymentStatusCard = ({ isPaid, paidAt, formatDate }) => {
  return (
    <div className='box mt-3'>
      {' '}
      {/* Added mt-3 for spacing */}
      <div className='body'>
        <h5 className='mb-3'>Payment</h5>
        <strong>Purchase Status:</strong>{' '}
        {isPaid ? (
          <MessageBox variant='success'>
            Paid with Square on {formatDate(paidAt)}
          </MessageBox>
        ) : (
          <MessageBox variant='warning'>
            Payment pending. You will receive a separate Square payment link to
            complete the purchase.
          </MessageBox>
        )}
      </div>
    </div>
  );
};

export default PaymentStatusCard;
