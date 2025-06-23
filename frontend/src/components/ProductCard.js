import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LazyLoad from 'react-lazyload';
import { useContext, useState } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { useMediaQuery } from 'react-responsive';

function ProductCard({ product, handleSidebarOpen = () => {} }) {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const [, setSidebarIsOpen] = useState(true);

  const addToCartHandler = async (item) => {
    console.log('Opening Sidebar...'); // Debugging

    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);

    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }

    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });

    if (isMobile) {
      // Show toast notification on mobile
      toast.success(
        <div>
          <LazyLoad>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '50px', height: '50px', marginRight: '10px' }}
              loading='lazy'
            />
          </LazyLoad>
          <span>{product.name} added to cart</span>
        </div>,
        {
          position: 'bottom-center',
          autoClose: 2000,
        }
      );
    } else {
      // Open sidebar on desktop
      setSidebarIsOpen(true);
      if (typeof handleSidebarOpen === 'function') {
        handleSidebarOpen(true);
      }
    }
  };

  // ProductCard is coming from Search.js | styles/product-card.css

  return (
    <div className='productContainer'>
      <Link to={`/product/${product.slug}`}>
        <LazyLoad height={200} offset={100}>
          <img
            src={product.image}
            alt={product.name}
            className='product-card-img'
            onError={(e) => (e.target.src = '/images/default.png')}
          />
        </LazyLoad>
      </Link>

      <div className='productContainer-body'>
        <Link
          to={`/product/${product.slug}`}
          style={{ textDecoration: 'none' }}
        >
          <p>{product.name}</p>
        </Link>

        <div className='productContainer-text'>
          {product.salePrice ? (
            <>
              <span style={{ textDecoration: 'line-through', color: 'gray' }}>
                ${product.price}
              </span>{' '}
              <span style={{ color: 'red', fontWeight: 'bold' }}>
                ${product.salePrice}
              </span>
            </>
          ) : (
            <>${product.price}</>
          )}
        </div>

        <div className='mt-auto'>
          {product.charishLink ? (
            <a
              href={product.charishLink}
              target='_blank'
              rel='noopener noreferrer'
            >
              <Button variant='warning' className='btn-sm'>
                View on Chairish
              </Button>
            </a>
          ) : product.countInStock === 0 ? (
            <Button variant='light' disabled>
              Out of stock
            </Button>
          ) : (
            <>
              {product.countInStock <= 5 && (
                <p className='only-few-left'>
                  Only {product.countInStock} left
                </p>
              )}
              <Button
                className='btn product-button'
                onClick={() => addToCartHandler(product)}
                disabled={product.quantity < 1}
              >
                {product.quantity < 1 ? 'Out of stock' : 'Add to cart'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
