import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getError } from '../utils';

export default function CategoriesCard() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);

        if (Array.isArray(data)) {
          const formattedCategories = data.map((category) => ({
            name: category._id,
            image: category.categoryImage || '/images/default.png',
          }));
          setCategories(formattedCategories);
        }
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className='categories-container content'>
      <Row>
        {categories.map((category) => (
          <Col xs={6} sm={6} md={3} lg={4} className='mb-4 px-2'>
            <div
              className='category-card'
              onClick={() =>
                navigate({
                  pathname: '/search',
                  search: `?category=${encodeURIComponent(category.name)}`,
                })
              }
              style={{ cursor: 'pointer' }}
            >
              <img
                src={category.image}
                alt={category.name}
                style={{
                  width: '100%',
                  height: window.innerWidth < 768 ? '250px' : '400px',
                  objectFit: 'cover',
                  marginBottom: '10px',
                  borderRadius: '10px',
                }}
                onError={(e) => (e.target.src = '/images/default.png')}
              />
              <div className='card-title'>{category.name}</div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
}
