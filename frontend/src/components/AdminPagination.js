import React from 'react';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const AdminPagination = ({
  currentPage,
  totalPages,
  isAdmin = true,
  keyword = '',
}) => {
  return (
    <div>
      {[...Array(totalPages).keys()].map((x) => (
        <LinkContainer
          key={x + 1}
          className='mx-1'
          to={
            isAdmin && keyword === ''
              ? `/admin/products?page=${x + 1}`
              : !isAdmin && keyword === ''
              ? `/products?page=${x + 1}`
              : isAdmin && keyword === 'OrderList'
              ? `/admin/orders?page=${x + 1}`
              : !isAdmin && keyword === 'OrderList'
              ? `/orders?page=${x + 1}`
              : isAdmin && keyword === 'UserList'
              ? `/admin/users?page=${x + 1}`
              : !isAdmin && keyword === 'UserList'
              ? `/users?page=${x + 1}`
              : isAdmin && keyword === 'Messages'
              ? `/admin/messages?page=${x + 1}`
              : !isAdmin && keyword === 'Messages'
              ? `/messages?page=${x + 1}`
              : '/'
          }
        >
          <Button
            className={currentPage === x + 1 ? 'text-bold' : ''}
            variant='light' // Set button variant to light
          >
            {x + 1} {/* Display page number on the button */}
          </Button>
        </LinkContainer>
      ))}
    </div>
  );
};

export default AdminPagination;
