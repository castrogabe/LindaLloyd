import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Skeleton from './Skeleton';

const SkeletonForgetPassword = () => {
  const isMobile = window.innerWidth <= 768; // Set your mobile breakpoint here

  return (
    <div>
      <br />
      {isMobile ? (
        <div>
          {/* Mobile view */}
          <Row className='box'>
            <Skeleton classes='title width-25 skeleton-title' />
          </Row>
          <br />
          <Row className='box'>
            <Skeleton classes='title width-25 skeleton-title' />
            <Skeleton classes='title width-100 skeleton-text mb-3' />
          </Row>
          <Row className='box'>
            <Skeleton classes='title width-25 skeleton-title' />
            <Skeleton classes='title width-100 skeleton-text mb-3' />
          </Row>
          <Row className='box'>
            <div className='skeleton-image' />
          </Row>
        </div>
      ) : (
        <div>
          {/* desktop view */}
          {/* right side */}
          <Row>
            <Col md={6}>
              <Row className='box'>
                <Skeleton classes='title width-25 skeleton-title' />
              </Row>
              <br />
              <Col className='box'>
                <Skeleton classes='title width-25 skeleton-title' />
                <Skeleton classes='title width-100 skeleton-text mb-3' />
                <Skeleton classes='title width-25 skeleton-title' />
              </Col>
            </Col>

            {/* left side */}
            <Col md={6}>
              <Row className='box'>
                <div className='skeleton-image' />
              </Row>
            </Col>
          </Row>
        </div>
      )}
      <br />
    </div>
  );
};

export default SkeletonForgetPassword;
