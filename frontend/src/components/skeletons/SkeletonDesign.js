import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Skeleton from './Skeleton';

const SkeletonDesign = () => {
  return (
    <>
      <Row>
        <Col md={12}>
          <br />
          <Row className='box'>
            <div className='skeleton-image'></div>
          </Row>

          <Row className='box'>
            <Skeleton classes='title width-25 skeleton-title' />
            <Skeleton classes='text width-100 skeleton-text mb-3' />
            <Skeleton classes='text width-100 skeleton-text mb-3' />
          </Row>

          <Row className='box'>
            <Skeleton classes='title width-25 skeleton-title' />
            <Skeleton classes='text width-100 skeleton-text mb-3' />
            <Skeleton classes='text width-100 skeleton-text mb-3' />
          </Row>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Row className='box'>
            <Skeleton classes='title width-25 skeleton-title' />
            <Skeleton classes='text width-100 skeleton-text mb-3' />
            <Skeleton classes='text width-100 skeleton-text mb-3' />
          </Row>
        </Col>

        <Col md={6}>
          <Row className='box'>
            <Skeleton classes='title width-25 skeleton-title' />
            <Skeleton classes='text width-100 skeleton-text mb-3' />
            <Skeleton classes='text width-100 skeleton-text mb-3' />
          </Row>
        </Col>

        <Col md={6}>
          <Row className='box'>
            <Skeleton classes='title width-25 skeleton-title' />
            <Skeleton classes='text width-100 skeleton-text mb-3' />
            <Skeleton classes='text width-100 skeleton-text mb-3' />
          </Row>
        </Col>

        <Col md={6}>
          <Row className='box'>
            <Skeleton classes='title width-25 skeleton-title' />
            <Skeleton classes='text width-100 skeleton-text mb-3' />
            <Skeleton classes='text width-100 skeleton-text mb-3' />
          </Row>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Row className='box'>
            <div className='skeleton-image' />
          </Row>
        </Col>

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

export default SkeletonDesign;
