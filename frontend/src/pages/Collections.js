import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import SkeletonGallery from '../components/skeletons/SkeletonGallery';

export default function Collections() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('/api/products');
        setProducts(result.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className='content'>
        <Helmet>
          <title>Collections</title>
        </Helmet>
        <br />
        <h1 className='box'>Collections</h1>
        <Row>
          {loading
            ? [...Array(8)].map((_, i) => (
                <Col key={i} sm={6} md={4} lg={3} className='mb-4'>
                  <SkeletonGallery />
                </Col>
              ))
            : products.map((product) => (
                <Col
                  key={product.slug}
                  xs={6}
                  sm={12}
                  md={6}
                  lg={4}
                  className={`mb-4 ${
                    window.innerWidth < 768
                      ? 'd-flex justify-content-center'
                      : ''
                  }`}
                >
                  <div
                    className='category-card'
                    onClick={() => navigate(`/product/${product.slug}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className='category-card-img'
                      style={{
                        width: '100%',
                        height: window.innerWidth < 768 ? '250px' : '400px',
                        objectFit: 'cover',
                        marginBottom: '10px',
                        borderRadius: '10px',
                      }}
                      onError={(e) => (e.target.src = '/images/default.png')}
                    />
                    <div className='card-title'>{product.name}</div>
                  </div>
                </Col>
              ))}
        </Row>
      </div>
    </>
  );
}
