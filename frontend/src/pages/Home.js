import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function HomeScreen() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('/api/products');
      setProducts(result.data);
    };
    fetchData();
  }, []);

  return (
    <>
      <div className='content'>
        <h1>Featured Products</h1>
        <div className='box'>
          <p className='mt-3'>
            ~ All Antiques, Art, and Collectibles are in good condition and sold
            as is. ~
          </p>
        </div>
        <br />
      </div>
      <Row>
        <Col>
          <div className='products'>
            {products.map((product) => (
              <div className='product' key={product.slug}>
                <Link to={`/product/${product.slug}`}>
                  <img src={product.image} alt={product.name} />
                </Link>
                <div className='product-info'>
                  <Link to={`/product/${product.slug}`}>
                    <p>{product.name}</p>
                  </Link>
                  <p>
                    <strong>${product.price}</strong>
                  </p>
                  <button>Add to cart</button>
                </div>
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </>
  );
}
