import React, { useEffect, useReducer, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Helmet } from 'react-helmet-async';
import { Row, Col } from 'react-bootstrap';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import Sidebar from '../components/Sidebar';
import { useMediaQuery } from 'react-responsive';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const prices = [
  { name: '$1 to $50', value: '1-50' },
  { name: '$51 to $200', value: '51-200' },
  { name: '$201 to $1000', value: '201-1000' },
];

export default function Search() {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const category = queryParams.get('category') || '';
  const query = queryParams.get('query') || 'all';
  const price = queryParams.get('price') || 'all';
  const rating = queryParams.get('rating') || 'all';
  const order = queryParams.get('order') || 'newest';
  const page = queryParams.get('page') || 1;

  const [{ loading, error, products, pages, countProducts }, dispatch] =
    useReducer(reducer, { loading: true, error: '' });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/products/categories');
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error('Invalid categories response:', data);
        }
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(
          `/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [category, order, page, price, query, rating]);

  const getFilterUrl = (filter) => {
    return `/search?category=${filter.category || category}&query=${
      filter.query || query
    }&price=${filter.price || price}&rating=${filter.rating || rating}&order=${
      filter.order || order
    }&page=${filter.page || page}`;
  };

  // Open Sidebar for desktop, show toast for mobile
  const handleSidebarOpen = () => {
    if (!isMobile) {
      setIsSidebarOpen(true);
      setTimeout(() => setIsSidebarOpen(false), 3000);
    }
  };

  return (
    <div className='content'>
      <Helmet>
        <title>Search Products</title>
      </Helmet>

      <Row className='mt-3'>
        <Col md={3} className='search'>
          <div>
            <h3>Categories</h3>
            <ul>
              <li key='any'>
                <Link
                  className={category === 'all' ? 'text-bold' : ''}
                  to={getFilterUrl({ category: 'all' })}
                >
                  Any
                </Link>
              </li>
              {categories.length > 0 ? (
                categories.map((c, index) => (
                  <li key={c._id || index}>
                    <Link
                      className={c._id === category ? 'text-bold' : ''}
                      to={getFilterUrl({ category: c._id })}
                    >
                      {c._id}
                    </Link>
                  </li>
                ))
              ) : (
                <li>Loading categories...</li>
              )}
            </ul>
          </div>

          <div>
            <h3>Price</h3>
            <ul>
              {prices.map((p) => (
                <li key={`price-${p.value}`}>
                  <Link
                    to={getFilterUrl({ price: p.value })}
                    className={p.value === price ? 'text-bold' : ''}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Col>

        <Col md={9}>
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant='danger'>{error}</MessageBox>
          ) : (
            <>
              <Row className='d-flex align-items-stretch'>
                {products.map((product) => (
                  <Col
                    key={product.slug}
                    xs={6} /* 2 per row on extra small screens */
                    sm={12} /* Full width on small screens */
                    md={6} /* 2 per row on medium screens */
                    lg={4} /* 3 per row on large screens */
                    className='mb-4 d-flex'
                  >
                    <ProductCard product={product} />
                  </Col>
                ))}
              </Row>

              {/* Render Sidebar if not mobile */}
              {!isMobile && isSidebarOpen && (
                <Sidebar handleSidebarOpen={setIsSidebarOpen} />
              )}

              {/* Pagination Component */}

              <div className='pagination-container'>
                <Pagination
                  currentPage={page}
                  totalPages={pages}
                  getFilterUrl={getFilterUrl}
                />
              </div>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
}
