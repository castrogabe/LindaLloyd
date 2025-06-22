import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Skeleton from './Skeleton';

const SkeletonProductList = () => {
  const isMobile = window.innerWidth <= 768; // Set your mobile breakpoint here

  return (
    <Row>
      {isMobile ? (
        <Row className='box col-12'>
          {/* mobile view */}
          <Col className='left-col col-4'>
            <Skeleton classes='square' />
          </Col>
          <Col className='right-col col-8'>
            <Skeleton classes='title width-100 skeleton-title' />
          </Col>
        </Row>
      ) : (
        <Row className='box col-12'>
          {/* desktop skeleton */}
          <Col className='left-col col-2'>
            <Skeleton classes='square' />
          </Col>
          <Col className='right-col col-10'>
            <Skeleton classes='title width-100 skeleton-title' />
          </Col>
        </Row>
      )}
    </Row>
  );
};

export default SkeletonProductList;
