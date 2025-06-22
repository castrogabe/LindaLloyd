import React, { useState } from 'react';
import { Button, Form, InputGroup, FormControl } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function SearchBox({ showSearch, setShowSearch }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search/?query=${query}` : '/search');
  };

  return (
    <Form
      className={`search-container ${showSearch ? 'expanded' : ''}`}
      onSubmit={submitHandler}
    >
      <InputGroup>
        <FormControl
          type='text'
          name='q'
          id='q'
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Search'
          aria-label='Search Products'
          aria-describedby='button-search'
        />
        <Button variant='outline-primary' type='submit' id='button-search'>
          <i className='fas fa-search'></i>
        </Button>

        {/* Show 'X' to close only in expanded mode */}
        {showSearch && (
          <Button variant='outline-danger' onClick={() => setShowSearch(false)}>
            <i className='fas fa-times'></i>
          </Button>
        )}
      </InputGroup>
    </Form>
  );
}
