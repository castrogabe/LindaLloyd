import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <Row className='content justify-content-center'>
        <Col md={2}>
          Connect with us
          <div className='socialIcon'>
            <ul className='list-unstyled'>
              <li>
                <a
                  href='https://www.facebook.com/LindaLloydAntiques'
                  className='email'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <i className='fab fa-facebook'></i> Facebook
                </a>
              </li>
              <li>
                <a
                  href='https://www.instagram.com/lindalloydantiques/?hl=en'
                  className='email'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <i className='fab fa-instagram'></i> Instagram
                </a>
              </li>
              <li>
                <a
                  href='https://www.chairish.com/shop/vozivo?global=true&path_name=%2F'
                  className='email'
                  target='_blank'
                  rel='noreferrer'
                >
                  <i className='fas fa-store'></i> Chairish
                </a>
              </li>
            </ul>
          </div>
        </Col>

        <Col md={2}>
          Get To Know Us
          <div className='socialIcon'>
            <ul className='list-unstyled'>
              <li>
                <Link to='/about' className='email'>
                  About Us
                </Link>
              </li>

              <li>
                <Link to='/collections' className='email'>
                  Collections
                </Link>
              </li>

              <li>
                <Link to='/soldGallery' className='email'>
                  Sold Gallery
                </Link>
              </li>

              <li>
                <Link to='/design' className='email'>
                  Design Philosophy
                </Link>
              </li>
              <li>
                <Link to='/askedQuestions' className='email'>
                  FAQ Questions
                </Link>
              </li>
            </ul>
          </div>
        </Col>

        <Col md={2}>
          Questions
          <div className='socialIcon'>
            <ul className='list-unstyled'>
              <li>
                <Link to='/contact' className='email'>
                  <i className='fa fa-envelope'></i> Contact Us
                </Link>
              </li>
              <li>
                <a href='mailto:sweetwatertc@yahoo.com' className='email'>
                  <i className='fa fa-envelope'></i> Email Me
                </a>
              </li>
            </ul>
          </div>
        </Col>

        <Col md={2}>
          Hours
          <div className='socialIcon'>
            <ul className='list-unstyled'>
              <li>Monday: Closed</li>
              <li>Tuesday: 11-5</li>
              <li>Wednesday: 11-5</li>
              <li>Thursday: 11-5</li>
              <li>Friday: 11-5</li>
              <li>Saturday: 11-5</li>
              <li>Sunday: 11-5</li>
            </ul>
          </div>
        </Col>

        <Col md={2}>
          Linda Lloyd Antiques & Interiors
          <div className='socialIcon'>
            <ul className='list-unstyled'>
              <li>1276 N Yale Ave</li>
              <li>Claremont, CA. 91711</li>
              {/* <li>(626) 392-2979</li> */}
            </ul>
          </div>
          <br />
          <div className='list-unstyled'>
            <i
              className='fas fa-lock'
              style={{ color: 'green', marginRight: '5px' }}
            ></i>
            Checkout by Square
          </div>
        </Col>
      </Row>

      <hr className='hrLine' />

      <Row>
        <Col className='text-center mt-3'>
          &copy;{new Date().getFullYear()} ~ LINDA LLOYD ~
        </Col>
      </Row>
    </footer>
  );
};

export default Footer;
