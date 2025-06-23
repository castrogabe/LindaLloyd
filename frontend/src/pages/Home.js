import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { toast } from 'react-toastify';
import CategoriesCard from '../components/CategoriesCard';
import Subscribe from '../components/Subscribe';
import { getError } from '../utils';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default function Home() {
  const [homeContent, setHomeContent] = useState({
    title: '',
    description: '',
    h4Text: [],
    jumbotronImages: [],
  });

  useEffect(() => {
    const fetchHomeContent = async () => {
      try {
        const { data } = await axios.get('/api/homecontent');
        setHomeContent(
          data || {
            title: '',
            description: '',
            h4Text: [],
            jumbotronImages: [],
          }
        );
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchHomeContent();
  }, []);

  return (
    <>
      <div>
        <Helmet>
          <title>Linda Lloyd</title>
        </Helmet>
        <br />
        {homeContent && (
          <div className='container'>
            <h2>{homeContent.title}</h2>
            <h4>
              {homeContent.h4Text.map((text, index) => (
                <span key={index}>
                  {text}
                  {index !== homeContent.h4Text.length - 1 && (
                    <span className='fleur-de-lis'>&nbsp;⚜&nbsp;</span>
                  )}
                </span>
              ))}
            </h4>
            <p>{homeContent.description}</p>
          </div>
        )}
        <br />

        {/* Jumbotron Image Carousel */}
        {homeContent.jumbotronImages.length > 0 && (
          <Carousel
            showThumbs={false}
            showStatus={false}
            autoPlay
            infiniteLoop
            interval={10000} // Slow down the carousel (5000ms = 5 seconds)
            transitionTime={1000} // Adjust transition speed (1000ms = 1 second)
          >
            {homeContent.jumbotronImages.map((image, index) => (
              <div key={index}>
                <img src={image} alt={`Jumbotron ${index}`} />
              </div>
            ))}
          </Carousel>
        )}
        <br />

        {/* Display categories */}
        <CategoriesCard />
        <Subscribe />
      </div>
      <br />
    </>
  );
}
