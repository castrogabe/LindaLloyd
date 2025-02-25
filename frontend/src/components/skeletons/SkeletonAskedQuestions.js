import React from 'react';
import { Row, Card, Col } from 'react-bootstrap';
import Skeleton from './Skeleton';

const SkeletonAskedQuestions = () => {
  const isMobile = window.innerWidth <= 768; // Set your mobile breakpoint here

  return (
    <div>
      <br />
      {isMobile ? (
        <div className='mobile-image-card'>
          <Col>
            <Card className='mobile-image-card'>
              <Col>
                <Skeleton classes='title width-50 skeleton-title' />
                <Skeleton classes='text width-100 skeleton-text' />
                <Skeleton classes='text width-100 skeleton-text' />
                <Skeleton classes='text width-100 skeleton-text' />
              </Col>
            </Card>

            <Card className='mobile-image-card'>
              <Col>
                <Skeleton classes='title width-50 skeleton-title' />
                <Skeleton classes='text width-100 skeleton-text' />
                <Skeleton classes='text width-100 skeleton-text' />
                <Skeleton classes='text width-100 skeleton-text' />
              </Col>
            </Card>

            <Card className='mobile-image-card'>
              <Col>
                <Skeleton classes='title width-50 skeleton-title' />
                <Skeleton classes='text width-100 skeleton-text' />
                <Skeleton classes='text width-100 skeleton-text' />
                <Skeleton classes='text width-100 skeleton-text' />
              </Col>
            </Card>

            <Card className='mobile-image-card'>
              <Col>
                <Skeleton classes='title width-50 skeleton-title' />
                <Skeleton classes='text width-100 skeleton-text' />
                <Skeleton classes='text width-100 skeleton-text' />
                <Skeleton classes='text width-100 skeleton-text' />
              </Col>
            </Card>
            <Card className='mobile-image-card'>
              <Col>
                <Skeleton classes='title width-50 skeleton-title' />
                <Skeleton classes='text width-100 skeleton-text' />
                <Skeleton classes='text width-100 skeleton-text' />
                <Skeleton classes='text width-100 skeleton-text' />
              </Col>
            </Card>
            <Card className='mobile-image-card'>
              <Col>
                <Skeleton classes='title width-50 skeleton-title' />
                <Skeleton classes='text width-100 skeleton-text' />
                <Skeleton classes='text width-100 skeleton-text' />
                <Skeleton classes='text width-100 skeleton-text' />
              </Col>
            </Card>
          </Col>
        </div>
      ) : (
        <Row>
          <Col md={12}>
            <br />
            <Row className='box'>
              <Skeleton classes='title width-25 skeleton-title' />
              <Skeleton classes='text width-100 skeleton-text mb-3' />
            </Row>
            <Row className='box'>
              <Skeleton classes='title width-25 skeleton-title' />
              <Skeleton classes='text width-100 skeleton-text mb-3' />
            </Row>

            <Row className='box'>
              <Skeleton classes='title width-25 skeleton-title' />
              <Skeleton classes='text width-100 skeleton-text mb-3' />
            </Row>

            <Row className='box'>
              <Skeleton classes='title width-25 skeleton-title' />
              <Skeleton classes='text width-100 skeleton-text mb-3' />
            </Row>

            <Row className='box'>
              <Skeleton classes='title width-25 skeleton-title' />
              <Skeleton classes='text width-100 skeleton-text mb-3' />
            </Row>

            <Row className='box'>
              <Skeleton classes='title width-25 skeleton-title' />
              <Skeleton classes='text width-100 skeleton-text mb-3' />
            </Row>

            <Row className='box'>
              <Skeleton classes='title width-25 skeleton-title' />
              <Skeleton classes='text width-100 skeleton-text mb-3' />
            </Row>

            <Row className='box'>
              <Skeleton classes='title width-25 skeleton-title' />
              <Skeleton classes='text width-100 skeleton-text mb-3' />
            </Row>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default SkeletonAskedQuestions;
