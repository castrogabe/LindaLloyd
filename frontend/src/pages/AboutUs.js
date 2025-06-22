import React, { useEffect, useState, useContext } from 'react';
import { Row, Col, Card, Image } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import SkeletonAbout from '../components/skeletons/SkeletonAboutUs';
import axios from 'axios';
import { Store } from '../Store'; // Import the store for userInfo

export default function About() {
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState({
    sections: [],
    jumbotronImage: null,
    shopImage: null, // Ensure shopImage is part of the state
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get('/api/about', {
          headers: userInfo
            ? { Authorization: `Bearer ${userInfo.token}` }
            : {},
        });

        // Ensure sections is always an array
        setContent({
          sections: Array.isArray(data.sections) ? data.sections : [],
          jumbotronImage: data.jumbotronImage || null,
          shopImage: data.shopImage || null, // Ensure shopImage is included
        });
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchContent();
  }, [userInfo]);

  return (
    <>
      <div className='content'>
        {isLoading ? (
          <SkeletonAbout />
        ) : (
          <>
            <Helmet>
              <title>About Linda Lloyd</title>
            </Helmet>
            <br />
            <Row>
              {/* Display dynamic Jumbotron Image */}
              {content.jumbotronImage?.url && (
                <Col md={12}>
                  <div className='box'>
                    <Image
                      src={content.jumbotronImage.url}
                      alt='jumbotron'
                      fluid
                    />
                  </div>
                </Col>
              )}
              {/* About Sections */}
              {content.sections.length === 0 ? (
                <p>Loading content...</p>
              ) : (
                content.sections.map((section, sectionIndex) => (
                  <Col md={12} key={sectionIndex}>
                    <div className='box'>
                      <h1>&#x269C; {section.title} &#x269C;</h1>
                      {section.paragraphs.map((paragraph, paragraphIndex) => (
                        <p key={paragraphIndex}>{paragraph}</p>
                      ))}
                    </div>
                  </Col>
                ))
              )}
            </Row>

            {/* Only display the shop image if it exists */}
            {content.shopImage?.url && (
              <div className='box'>
                <Card>
                  <Image src={content.shopImage.url} alt='Shop' fluid />
                </Card>
              </div>
            )}

            <br />
          </>
        )}
      </div>
    </>
  );
}
