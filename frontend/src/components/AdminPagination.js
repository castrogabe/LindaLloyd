import React from 'react';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const AdminPagination = ({
  currentPage,
  totalPages,
  isAdmin = true,
  keyword = '',
}) => {
  const getPathAndSearch = (x) => {
    const pageSearch = `?page=${x + 1}`;

    if (isAdmin && keyword === '')
      return { pathname: '/admin/products', search: pageSearch };
    if (!isAdmin && keyword === '')
      return { pathname: '/products', search: pageSearch };
    if (isAdmin && keyword === 'OrderList')
      return { pathname: '/admin/orders', search: pageSearch };
    if (!isAdmin && keyword === 'OrderList')
      return { pathname: '/orders', search: pageSearch };
    if (isAdmin && keyword === 'UserList')
      return { pathname: '/admin/users', search: pageSearch };
    if (!isAdmin && keyword === 'UserList')
      return { pathname: '/users', search: pageSearch };
    if (isAdmin && keyword === 'Messages')
      return { pathname: '/admin/messages', search: pageSearch };
    if (!isAdmin && keyword === 'Messages')
      return { pathname: '/messages', search: pageSearch };

    return { pathname: '/' };
  };

  return (
    <div>
      {[...Array(totalPages).keys()].map((x) => (
        <LinkContainer key={x + 1} className='mx-1' to={getPathAndSearch(x)}>
          <Button
            className={currentPage === x + 1 ? 'text-bold' : ''}
            variant='light'
          >
            {x + 1}
          </Button>
        </LinkContainer>
      ))}
    </div>
  );
};

export default AdminPagination;
