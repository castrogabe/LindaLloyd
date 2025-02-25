import React from 'react';
import { Row, Card, Col } from 'react-bootstrap';
import Skeleton from './Skeleton';

const SkeletonContact = () => {
  const isMobile = window.innerWidth <= 768; // Set your mobile breakpoint here

  return (
    <div>
      <br />
      {isMobile ? (
        <div className='mobile-image-card'>
          <Col>
            <Card className='mobile-image-card'>
              <Col>
                <Skeleton classes='title width-25 skeleton-title' />
                <Skeleton classes='title width-100 skeleton-text mb-3' />
              </Col>
            </Card>

            <Card className='mobile-image-card'>
              <Col>
                <Skeleton classes='title width-25 skeleton-title' />
                <Skeleton classes='title width-100 skeleton-text mb-3' />
              </Col>
            </Card>

            <Card className='mobile-image-card'>
              <Col>
                <Skeleton classes='title width-25 skeleton-title' />
                <Skeleton classes='title width-100 skeleton-text mb-3' />
              </Col>
            </Card>

            <Card className='mobile-image-card'>
              <Col>
                <Skeleton classes='title width-25 skeleton-title' />
                <Skeleton classes='title width-100 skeleton-text mb-3' />
              </Col>
            </Card>
          </Col>
        </div>
      ) : (
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
      )}
      <br />
    </div>
  );
};

export default SkeletonContact;
