import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
      console.error('Subscribe error:', error.response?.data || error.message);
      const message =
        error.response?.data?.message ||
        'Subscription failed. Please try again.';

      if (message === 'Email already subscribed') {
        toast.info("Thank you, you're already on the list!");
      } else {
        toast.error(message);
      }
    }
  };

  return (
    <div className='subscribe-container'>
      <h2 className='subscribe-title'>
        SUBSCRIBE TO OUR EMAIL LIST and CREATE ACCOUNT
      </h2>
      <p className='subscribe-text'>
        No spam, just the good stuff!
        <br />
        <Link
          to='/signup?redirect=/'
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          Create an account →
        </Link>
      </p>

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
