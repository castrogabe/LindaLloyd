import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';

export default function SquareCheckout({
  orderId,
  totalPrice,
  userInfo,
  onSuccess,
}) {
  const cardRef = useRef();
  const hasInitialized = useRef(false); // 👈 NEW
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSquare = async () => {
      if (hasInitialized.current) return; // 🛑 Prevent double run
      hasInitialized.current = true; // ✅ Guard it

      if (!window.Square) {
        console.error('Square.js failed to load');
        return;
      }

      try {
        const { data } = await axios.get('/api/square/key');
        const { appId, locationId } = data;

        const squarePayments = window.Square.payments(appId, locationId);

        const container = document.getElementById('card-container');
        if (container) {
          container.innerHTML = ''; // Wipe out previous iframe if exists
        }

        const card = await squarePayments.card();
        await card.attach('#card-container');
        setCard(card);
      } catch (err) {
        console.error('Square Payments Setup Error:', err);
      }
    };

    loadSquare();

    // 🧼 Optional cleanup on unmount
    return () => {
      const container = document.getElementById('card-container');
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  const handlePayment = async () => {
    if (!card) return;

    setLoading(true);

    try {
      const result = await card.tokenize();
      if (result.status !== 'OK') {
        throw new Error(result.errors?.[0]?.message || 'Tokenization failed');
      }

      const { data } = await axios.post(
        '/api/square/create-payment',
        {
          sourceId: result.token,
          orderId,
          amount: totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      // Call parent handler to update payment status
      if (data.payment && data.payment.status === 'COMPLETED') {
        onSuccess(data.payment);
      }
    } catch (err) {
      console.error(err);
      alert('Payment failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div id='card-container' ref={cardRef}></div>
      <br />
      <Button onClick={handlePayment} disabled={loading}>
        {loading ? 'Processing...' : 'Pay with Card'}
      </Button>
    </div>
  );
}
