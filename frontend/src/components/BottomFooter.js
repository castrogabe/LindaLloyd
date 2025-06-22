import React from 'react';
import { Row, Col } from 'react-bootstrap';

const BottomFooter = () => {
  return (
    <div className='bottom-footer'>
      <Row>
        <Col className='text-center'>
          Web Development{' '}
          <a
            href='https://www.gabewd.com/'
            target='_blank'
            rel='noopener noreferrer'
            id='linked'
          >
            &copy; gabewd.com
          </a>
        </Col>
      </Row>
    </div>
  );
};

export default BottomFooter;
