import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';

export default function AboutUs() {
  return (
    <>
      <div className='content'>
        <Helmet>
          <title>About Us</title>
        </Helmet>
        <Row>
          <Col className='mt-3'>
            <h2>About Us</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              dignissim purus at libero hendrerit dapibus. Vestibulum vel felis
              quis lectus sollicitudin eleifend. Sed vitae orci id mi accumsan
              luctus.
            </p>
            <p>
              Proin interdum bibendum augue, id aliquet nibh fringilla in. Morbi
              ac justo eu augue tincidunt eleifend. Vivamus vehicula ultricies
              quam, nec egestas erat auctor id.
            </p>
          </Col>
          <div className='col-lg-6 mt-3'>
            <img src='/images/antiques.png' alt='antiques' class='img-fluid' />
          </div>
        </Row>
      </div>
    </>
  );
}
