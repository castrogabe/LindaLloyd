import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import SkeletonAskedQuestions from '../components/skeletons/SkeletonAskedQuestions';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';

export default function AskedQuestions() {
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState({ faqs: [] });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get('/api/faqs');
        console.log('Fetched FAQ data:', data);
        setContent(data || { faqs: [] });
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchContent();
  }, []);

  return (
    <>
      <div className='content'>
        <Helmet>
          <title>FAQ</title>
        </Helmet>
        <br />
        <h1 className='box'>Frequently Asked Questions</h1>
        {isLoading ? (
          <SkeletonAskedQuestions />
        ) : (
          <Row>
            <Col md={12}>
              {content.faqs && content.faqs.length > 0 ? (
                content.faqs.map((faq, index) => (
                  <div className='box' key={index}>
                    <h1>&#x269C; {faq.question} &#x269C;</h1>
                    <p>
                      <span
                        style={{ color: 'gold' }}
                        className='outlined-tilde'
                      >
                        ~{' '}
                      </span>
                      {faq.answer}{' '}
                      <span
                        style={{ color: 'gold' }}
                        className='outlined-tilde'
                      >
                        ~
                      </span>
                    </p>
                  </div>
                ))
              ) : (
                <p>No FAQs available.</p>
              )}
            </Col>
          </Row>
        )}
      </div>
    </>
  );
}
