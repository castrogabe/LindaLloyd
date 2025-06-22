import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Skeleton from './Skeleton';

const SkeletonDashboard = () => {
  const isMobile = window.innerWidth <= 768;

  return (
    <>
      <div>
        {/* Mobile View */}
        {isMobile && (
          <>
            <Col>
              <Col className='box'>
                <Skeleton classes='title width-25 skeleton-title mb-3' />
              </Col>

              <Col className='box'>
                <Skeleton classes='title width-25 skeleton-title mb-3' />
              </Col>

              <Col className='box'>
                <Skeleton classes='title width-50 skeleton-title mb-3' />
                <Skeleton classes='title width-100 skeleton-title mb-3' />
              </Col>
            </Col>
          </>
        )}

        {/* Desktop View */}
        {!isMobile && (
          <>
            <br />
            <Row className='box'>
              <Skeleton classes='title width-25 skeleton-title mb-3' />
            </Row>

            <Row>
              <Col md={8} className='box'>
                <Skeleton classes='title width-25 skeleton-title mb-3' />
              </Col>

              <Col md={4} className='box'>
                <Skeleton classes='title width-50 skeleton-title mb-3' />
                <Skeleton classes='title width-100 skeleton-title mb-3' />
              </Col>
            </Row>
          </>
        )}
        <br />
      </div>
    </>
  );
};

export default SkeletonDashboard;
