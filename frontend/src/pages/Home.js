import React, { useEffect, useReducer, useState } from 'react';
import Jumbotron from '../components/Jumbotron';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { getError } from '../utils';
import { Helmet } from 'react-helmet-async';
import { Row, Col } from 'react-bootstrap';
import MessageBox from '../components/MessageBox';
import ProductCard from '../components/ProductCard';
import Sidebar from '../components/Sidebar';
import { useMediaQuery } from 'react-responsive';
import SkeletonHome from '../components/skeletons/SkeletonHome';
import Pagination from '../components/Pagination';

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

export default function Home() {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [homeContent, setHomeContent] = useState({
    title: '',
    description: '',
    jumbotronText: [],
    h4Text: [],
  });

  const handleSidebarOpen = () => {
    setIsSidebarOpen(true);
    setTimeout(() => {
      setIsSidebarOpen(false);
    }, 2000); // Close sidebar 2000 milliseconds (2 second)
  };
  // By adding the setTimeout callback inside the handleSidebarOpen function,
  // it will open the sidebar by setting isSidebarOpen to true and then close it by
  // setting isSidebarOpen back to false after the specified duration.

  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search); // /search?category = products
  const page = sp.get('page') || 1;

  const [{ loading, error, products, pages }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      // Simulate delay for 1.5 seconds
      await new Promise((resolve) => setTimeout(resolve, 1500));

      try {
        const { data } = await axios.get(`/api/products/search?page=${page}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [page, error]);

  useEffect(() => {
    const fetchHomeContent = async () => {
      try {
        const { data } = await axios.get('/api/homecontent');
        setHomeContent(
          data || { title: '', description: '', jumbotronText: [], h4Text: [] }
        );
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchHomeContent();
  }, []);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, [dispatch]);

  // Pagination
  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    return `/?&page=${filterPage}`;
  };

  return (
    <>
      <div className='jumbotron1' alt='tools'>
        <Jumbotron text={homeContent.jumbotronText} />
      </div>

      <div className='content'>
        <br />
        <Helmet>
          <title>Linda Lloyd</title>
        </Helmet>
        <div className='box'>
          {homeContent && (
            <>
              <h1>&#x269C; {homeContent.title} &#x269C;</h1>
              <h4>
                {homeContent.h4Text.map((text, index) => (
                  <span key={index} className='item'>
                    {text}
                  </span>
                ))}
              </h4>
              <p>
                <span style={{ color: 'gold' }} className='outlined-tilde'>
                  ~
                </span>{' '}
                {homeContent.description}{' '}
                <span style={{ color: 'gold' }} className='outlined-tilde'>
                  ~
                </span>
              </p>
            </>
          )}
        </div>
        <div className='parallax'></div>
        <br />
        <Row>
          <Col>
            {loading ? (
              <>
                <Row>
                  {[...Array(6).keys()].map((i) => (
                    <Col key={i} sm={6} md={4} lg={2} xl={2} className='mb-3'>
                      <SkeletonHome />
                    </Col>
                  ))}
                </Row>
                <Row>
                  {[...Array(6).keys()].map((i) => (
                    <Col key={i} sm={6} md={4} lg={2} xl={2} className='mb-3'>
                      <SkeletonHome />
                    </Col>
                  ))}
                </Row>
              </>
            ) : error ? (
              <MessageBox variant='danger'>{error}</MessageBox>
            ) : (
              <>
                {products.length === 0 && (
                  <MessageBox>No Product Found</MessageBox>
                )}
                <Row>
                  {products.map((product) => (
                    // 6 columns
                    <Col
                      key={product.slug}
                      sm={6}
                      md={4}
                      lg={2}
                      xl={2}
                      className='mb-3'
                    >
                      {/* ProductCard comes from components > ProductCard.js */}
                      <ProductCard
                        key={product.id}
                        product={product}
                        handleSidebarOpen={handleSidebarOpen}
                      />
                    </Col>
                  ))}
                </Row>

                {/* Desktop renders sidebar, if mobile do not show sidebar and get toast notifications lesson 12*/}
                {!isMobile ? (
                  isSidebarOpen && (
                    <div className='sidebar'>
                      <Sidebar handleSidebarOpen={handleSidebarOpen} />
                    </div>
                  )
                ) : (
                  <ToastContainer position='bottom-center' />
                )}

                {/* Pagination Component */}
                <Pagination
                  currentPage={page}
                  totalPages={pages}
                  getFilterUrl={getFilterUrl}
                />
                <br />
              </>
            )}
          </Col>
        </Row>
      </div>
    </>
  );
}
