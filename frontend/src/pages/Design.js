import React, { useEffect, useState } from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import SkeletonDesign from '../components/skeletons/SkeletonDesign';
import axios from 'axios';

export default function Design() {
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState({ sections: [] });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get('/api/design');
        setContent(data || { sections: [] }); // Ensure data is an object with sections
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
        {isLoading ? (
          <SkeletonDesign />
        ) : (
          <>
            <Helmet>
              <title>Design Page</title>
            </Helmet>
            <br />
            <Row>
              <Col md={12}>
                <div className='box'>
                  <Image src='/images/jumbotron2.png' alt='jumbotron' fluid />
                </div>
                {content.sections.map((section, sectionIndex) => (
                  <div className='box' key={sectionIndex}>
                    <h1>&#x269C; {section.title} &#x269C;</h1>
                    {section.paragraphs.map((paragraph, paragraphIndex) => (
                      <p key={paragraphIndex}>{paragraph}</p>
                    ))}
                  </div>
                ))}
              </Col>
            </Row>
            <br />
          </>
        )}
      </div>
    </>
  );
}
