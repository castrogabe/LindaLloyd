import React from 'react';
import Skeleton from './Skeleton';
import { Card, Col } from 'react-bootstrap';

function SkeletonGallery() {
  const isMobile = window.innerWidth <= 768; // Set your mobile breakpoint here

  return (
    <>
      {isMobile ? (
        <Col sm={6} md={4} lg={3} xl={3} className='mb-3'>
          <Skeleton classes='img-large' />
          <Skeleton classes='text width-50 skeleton-text' />
        </Col>
      ) : (
        <Col sm={6} md={4} lg={3} xl={3} className='mb-3'>
          <Card>
            {/* desktop skeleton */}
            <Skeleton classes='image width-100' />
            <br />
            <Skeleton classes='title width-75 skeleton-title' />
          </Card>
        </Col>
      )}
    </>
  );
}

export default SkeletonGallery;
