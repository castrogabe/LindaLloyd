import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Skeleton from './Skeleton';

const SkeletonAbout = () => {
  return (
    <>
      <Row>
        <Col md={12}>
          <br />
          {/* Main Image */}
          <Row className='box'>
            <div className='skeleton-image'></div>
          </Row>

          {/* About Us */}
          <Row className='box'>
            <Skeleton classes='title width-25 skeleton-title' />
            <Skeleton classes='text width-100 skeleton-text mb-3' />
            <Skeleton classes='text width-100 skeleton-text mb-3' />
          </Row>

          {/* Various Collecting */}
          <Row className='box'>
            <Skeleton classes='title width-25 skeleton-title' />
            <Skeleton classes='text width-100 skeleton-text mb-3' />
            <Skeleton classes='text width-100 skeleton-text mb-3' />
          </Row>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          {/* Wood and Stone */}
          <Row className='box'>
            <Skeleton classes='title width-25 skeleton-title' />
            <Skeleton classes='text width-100 skeleton-text mb-3' />
            <Skeleton classes='text width-100 skeleton-text mb-3' />
          </Row>
        </Col>
        <Col md={6}>
          {/* Ceramics */}
          <Row className='box'>
            <Skeleton classes='title width-25 skeleton-title' />
            <Skeleton classes='text width-100 skeleton-text mb-3' />
            <Skeleton classes='text width-100 skeleton-text mb-3' />
          </Row>
        </Col>
        <Col md={6}>
          {/* Asian */}
          <Row className='box'>
            <Skeleton classes='title width-25 skeleton-title' />
            <Skeleton classes='text width-100 skeleton-text mb-3' />
            <Skeleton classes='text width-100 skeleton-text mb-3' />
          </Row>
        </Col>
        <Col md={6}>
          {/* Favorite Collections */}
          <Row className='box'>
            <Skeleton classes='title width-25 skeleton-title' />
            <Skeleton classes='text width-100 skeleton-text mb-3' />
            <Skeleton classes='text width-100 skeleton-text mb-3' />
          </Row>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          {/* Antique Shop Image */}
          <Row className='box'>
            <div className='skeleton-image' />
          </Row>
        </Col>

        {/* Our Mission */}
        <Col md={6}>
          <Row className='box'>
            <Skeleton classes='title width-25 skeleton-title' />
            <Skeleton classes='text width-100 skeleton-text mb-3' />
            <Skeleton classes='text width-100 skeleton-text mb-3' />
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default SkeletonAbout;
