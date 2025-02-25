import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Skeleton from './Skeleton';

const SkeletonPaymentMethod = () => {
  const isMobile = window.innerWidth <= 768; // Set your mobile breakpoint here

  return (
    <div>
      <br />
      {isMobile ? (
        <div className='container small-container'>
          {/* Mobile view */}
          <Row className='box'>
            <Skeleton classes='title width-25 skeleton-title' />
          </Row>
          <br />
          <Row className='box'>
            <Skeleton classes='title width-25 skeleton-title' />
            <Skeleton classes='title width-100 skeleton-text mb-3' />
          </Row>
        </div>
      ) : (
        <div className='container small-container'>
          {/* Desktop view */}
          <Row md={8}>
            <Row className='box'>
              <Skeleton classes='title width-50 skeleton-title' />
            </Row>
            <br />
            <Col className='box' md={12}>
              <Skeleton classes='title width-25 skeleton-title' />
              <Skeleton classes='title width-25 skeleton-title' />
              <Skeleton classes='text width-25 skeleton-button' />
            </Col>
          </Row>
        </div>
      )}
      <br />
    </div>
  );
};

export default SkeletonPaymentMethod;
