import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Skeleton from './Skeleton';

const SkeletonProfile = () => {
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
          <Row className='box'>
            <Skeleton classes='title width-25 skeleton-title' />
            <Skeleton classes='title width-100 skeleton-text mb-3' />
          </Row>
          <Row className='box'>
            <Skeleton classes='title width-25 skeleton-title' />
            <Skeleton classes='title width-100 skeleton-text mb-3' />
          </Row>
          <Row className='box'>
            <Skeleton classes='title width-25 skeleton-title' />
            <Skeleton classes='title width-100 skeleton-text mb-3' />
          </Row>
        </div>
      ) : (
        <div className='container small-container'>
          {/* Desktop view */}
          <Row md={8}>
            <Col className='box' md={12}>
              <Skeleton classes='title width-25 skeleton-title' />
            </Col>
            <Col className='box' md={12}>
              <Skeleton classes='title width-25 skeleton-title' />
              <Skeleton classes='title width-100 skeleton-text mb-3' />
            </Col>
            <Col className='box' md={12}>
              <Skeleton classes='title width-25 skeleton-title' />
              <Skeleton classes='title width-100 skeleton-text mb-3' />
            </Col>
            <Col className='box' md={12}>
              <Skeleton classes='title width-25 skeleton-title' />
              <Skeleton classes='title width-100 skeleton-text mb-3' />
            </Col>
            <Col className='box' md={12}>
              <Skeleton classes='title width-25 skeleton-title' />
              <Skeleton classes='title width-100 skeleton-text mb-3' />
            </Col>
          </Row>
        </div>
      )}
      <br />
    </div>
  );
};

export default SkeletonProfile;
