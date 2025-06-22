import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Subscribe() {
  const [email, setEmail] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter a valid email address.');
      return;
    }

    try {
      await axios.post('/api/subscribe', { email });
      toast.success('Subscribed successfully!');
      setEmail('');
    } catch (error) {
      toast.error('Subscription failed. Please try again.');
    }
  };

  return (
    <div className='subscribe-container'>
      <h2 className='subscribe-title'>SUBSCRIBE TO OUR EMAIL LIST</h2>
      <p className='subscribe-text'>No spam, just the good stuff!</p>
      <form onSubmit={handleSubscribe} className='subscribe-form'>
        <input
          type='email'
          placeholder='Email address'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type='submit'>
          <i className='fas fa-arrow-right'></i>
        </button>
      </form>
    </div>
  );
}
