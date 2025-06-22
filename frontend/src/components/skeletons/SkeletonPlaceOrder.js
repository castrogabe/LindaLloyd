import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Skeleton from './Skeleton';

const SkeletonPlaceOrder = () => {
  const isMobile = window.innerWidth <= 768; // Set your mobile breakpoint here

  return (
    <div>
      {isMobile ? (
        <div className='container small-container'>
          {/* Mobile view */}
          <Row className='box'>
            <Skeleton classes='title width-100 skeleton-title' />
          </Row>
          <br />
          <Row className='box'>
            <Col md={4}>
              <Row>
                <Col className='left-col'>
                  <Skeleton classes='square' />
                </Col>
                <Col className='right-col'>
                  <Skeleton classes='title width-100 skeleton-title' />
                  <Skeleton classes='text width-100 skeleton-text' />
                </Col>
              </Row>
            </Col>
          </Row>
          <br />
          <Row className='box'>
            <Col className='box'>
              <Skeleton classes='title width-25 skeleton-title' />
              <Skeleton classes='title width-25 skeleton-title' />
              <Skeleton classes='title width-25 skeleton-title' />
              <Skeleton classes='title width-25 skeleton-title' />
            </Col>
          </Row>
          <br />
          <Row className='box'>
            <Col className='box'>
              <Skeleton classes='title width-25 skeleton-title' />
              <Skeleton classes='title width-100 skeleton-title' />
            </Col>
          </Row>
        </div>
      ) : (
        // Desktop view skeleton remains unchanged
        <div className='content'>
          <br />
          <Row className='box'>
            <Skeleton classes='title width-100 skeleton-title' />
          </Row>
          <br />
          <Row className='col-12'>
            <Col md={9}>
              <Col className='box'>
                <Row>
                  <Col className='left-col col-2'>
                    <Skeleton classes='square' />
                  </Col>
                  <Col className='right-col col-10'>
                    <br />
                    <Skeleton classes='title width-100 skeleton-title' />
                  </Col>
                </Row>
              </Col>
              <br />
              <Col className='box'>
                <Skeleton classes='title width-25 skeleton-title' />
                <Skeleton classes='title width-25 skeleton-title' />
                <Skeleton classes='title width-25 skeleton-title' />
                <Skeleton classes='title width-25 skeleton-title' />
              </Col>
              <br />
              <Col className='box'>
                <Skeleton classes='title width-25 skeleton-title' />
                <Skeleton classes='title width-100 skeleton-title' />
              </Col>
            </Col>
            <Col md={3} className='box'>
              <Skeleton classes='title width-100 skeleton-title' />
              <Skeleton classes='title width-100 skeleton-title' />
              <Skeleton classes='title width-100 skeleton-title' />
              <Skeleton classes='title width-100 skeleton-title' />
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default SkeletonPlaceOrder;
