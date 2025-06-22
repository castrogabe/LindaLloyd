import axios from 'axios';
import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Col, Row, ListGroup, Badge, Button } from 'react-bootstrap';
import ReactImageMagnify from 'react-image-magnify';
import { Helmet } from 'react-helmet-async';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { Store } from '../Store';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useMediaQuery } from 'react-responsive';
import SkeletonProductMag from '../components/skeletons/SkeletonProductMag';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'FETCH_CONTENT_REQUEST':
      return { ...state, loadingContent: true };
    case 'FETCH_CONTENT_SUCCESS':
      return { ...state, content: action.payload, loadingContent: false };
    case 'FETCH_CONTENT_FAIL':
      return { ...state, loadingContent: false, errorContent: action.payload };
    default:
      return state;
  }
};

function ProductMag() {
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const [
    { loading, error, product, loadingContent, content = [], errorContent },
    dispatch,
  ] = useReducer(reducer, {
    product: { images: [] },
    loading: true,
    error: '',
    loadingContent: true,
    errorContent: '',
    content: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  // Content Edit Screen
  useEffect(() => {
    const fetchContent = async () => {
      dispatch({ type: 'FETCH_CONTENT_REQUEST' });
      try {
        const result = await axios.get('/api/productmagcontent');
        dispatch({
          type: 'FETCH_CONTENT_SUCCESS',
          payload: result.data.sections,
        });
      } catch (err) {
        dispatch({ type: 'FETCH_CONTENT_FAIL', payload: getError(err) });
      }
    };
    fetchContent();
  }, []);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: {
        ...product,
        quantity,
      },
    });
    navigate('/cart');
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // zoom magnifier
  const images = [product.image, ...product.images];
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const hoverHandler = (image, i) => {
    setSelectedImage(image);
    refs.current[i].classList.add('active1');
    for (var j = 0; j < images.length; j++) {
      if (i !== j) {
        refs.current[j].classList.remove('active1');
      }
    }
    const textElement = document.querySelector('.text');
    if (textElement) {
      textElement.textContent = 'Click to Enlarge or Hover to Zoom';
    }
  };
  const hoverOffHandler = (i) => {
    refs.current[i].classList.remove('active1');
  };

  const refs = useRef([]);
  refs.current = [];
  const addRefs = (el) => {
    if (el && !refs.current.includes(el)) {
      refs.current.push(el);
    }
  };
  // end zoom magnifier

  const mobileView = useMediaQuery({ maxWidth: 992 });

  const handleArrowClick = (direction) => {
    let newIndex;
    if (direction === 'prev') {
      newIndex =
        (images.indexOf(selectedImage) - 1 + images.length) % images.length;
    } else {
      newIndex = (images.indexOf(selectedImage) + 1) % images.length;
    }
    setSelectedImage(images[newIndex]);
  };

  return loading ? (
    <SkeletonProductMag />
  ) : error ? (
    <MessageBox variant='danger'>{error}</MessageBox>
  ) : (
    <div className='content'>
      <Helmet>
        <title>{product.name}</title>
      </Helmet>
      <br />
      {loadingContent ? (
        <SkeletonProductMag />
      ) : errorContent ? (
        <MessageBox variant='danger'>{errorContent}</MessageBox>
      ) : (
        content.map((section, index) => (
          <Row key={index} className='box'>
            <h1>{section.title}</h1>
            {section.paragraphs.map((paragraph, pIndex) => (
              <p key={pIndex}>&#x269C; {paragraph} &#x269C;</p>
            ))}
          </Row>
        ))
      )}

      <Row>
        <Col
          md={1}
          className='d-flex justify-content-center align-items-center'
        >
          <button
            className='control-arrow control-prev'
            onClick={() => handleArrowClick('prev')}
          >
            {/* left triangle */}
            <span>&#9664;</span>
          </button>
        </Col>
        <Col md={4} className='container'>
          {mobileView ? (
            <Carousel>
              {product.images.map((image, index) => (
                <div key={index}>
                  <img
                    src={image}
                    alt={product.name}
                    className='img-large'
                    loading='lazy'
                  />
                </div>
              ))}
            </Carousel>
          ) : (
            <div className='left'>
              {/* thumbnail images */}
              <div className='left_1'>
                {[product.image, ...product.images].map((image, i) => (
                  <div
                    className={i === 0 ? 'img_wrap active' : 'img_wrap'}
                    key={i}
                    onMouseOver={() => hoverHandler(image, i)}
                    onMouseLeave={() => hoverOffHandler(i)}
                    ref={addRefs}
                    onClick={() => openLightbox(i + 1)}
                  >
                    <Card.Img src={image} alt='' loading='lazy' />
                  </div>
                ))}
              </div>

              {/* main image */}
              <div className='img-large' onClick={() => openLightbox(0)}>
                <ReactImageMagnify
                  {...{
                    smallImage: {
                      src: selectedImage || product.image,
                      alt: '',
                      isFluidWidth: true,
                    },
                    largeImage: {
                      src: selectedImage || product.image,
                      width: 1200,
                      height: 1800,
                    },
                    enlargedImageContainerDimensions: {
                      width: '160%',
                      height: '125%',
                    },
                  }}
                />
                <p className='text'>
                  Roll over image to zoom in or Click to enlarge
                </p>
              </div>
            </div>
          )}
        </Col>
        <Col
          md={1}
          className='d-flex justify-content-center align-items-center'
        >
          <button
            className='control-arrow control-next'
            onClick={() => handleArrowClick('next')}
          >
            {/* right triangle */}
            <span>&#9654;</span>
          </button>
        </Col>
        <Col md={6}>
          <div className='box'>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h4 className='details-list'>{product.name}</h4>
              </ListGroup.Item>
              <ListGroup.Item>
                <a href='/contact' className='contact-button'>
                  Contact Linda Lloyd
                </a>
              </ListGroup.Item>
              <ListGroup.Item>
                <ul className='details-list'>
                  <li>
                    <strong>Condition:</strong> {product.condition}
                  </li>
                  <li>
                    <strong>Dimensions:</strong> {product.dimensions}
                  </li>
                  <li>
                    <strong>From:</strong> {product.from}
                  </li>
                  <li>
                    <strong>Materials:</strong> {product.materials}
                  </li>
                  <li>
                    <strong>Period:</strong> {product.period}
                  </li>
                  <li>
                    <strong>Maker:</strong> {product.maker}
                  </li>
                  <li>
                    <strong>Provenance:</strong>{' '}
                    {product.provenance ? 'Yes' : 'No'}
                  </li>
                  <li>
                    <strong>Details:</strong>
                    <p className='product-details'>{product.description}</p>
                  </li>
                </ul>
              </ListGroup.Item>
            </ListGroup>
          </div>

          <br />

          <div className='box'>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>
                    {product.salePrice ? (
                      <>
                        <span
                          style={{
                            textDecoration: 'line-through',
                            color: 'gray',
                          }}
                        >
                          ${product.price.toFixed(2)}
                        </span>
                        <br />
                        <span
                          style={{
                            color: 'red',
                            fontWeight: 'bold',
                          }}
                        >
                          ${product.salePrice}
                        </span>
                      </>
                    ) : (
                      <strong>${product.price}</strong>
                    )}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    {product.countInStock > 0 ? (
                      <Badge bg='success'>In Stock</Badge>
                    ) : (
                      <Badge bg='danger'>Unavailable</Badge>
                    )}
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <div className='d-grid'>
                  {product.charishLink ? (
                    // Display "View on Charish" if the product has a Charish link
                    <a
                      href={product.charishLink}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <Button variant='warning' className='btn-sm'>
                        View on Charish
                      </Button>
                    </a>
                  ) : product.countInStock > 0 ? (
                    <>
                      {/* Display low quantity warning if 5 or less in stock */}
                      {product.countInStock <= 5 && (
                        <p style={{ color: 'red' }}>
                          Only {product.countInStock} Left, Buy Now!
                        </p>
                      )}
                      {/* Display "Add to Cart" button if no Charish link */}
                      <Button onClick={addToCartHandler} variant='primary'>
                        Add to Cart
                      </Button>
                    </>
                  ) : (
                    <Button variant='light' disabled>
                      Out of stock
                    </Button>
                  )}
                </div>
              </ListGroup.Item>
            </ListGroup>
          </div>
        </Col>
      </Row>

      <br />

      {/* Lightbox */}
      <div className='lightbox'>
        {lightboxOpen && (
          <Lightbox
            mainSrc={
              lightboxIndex === 0
                ? product.image
                : product.images[lightboxIndex - 1]
            }
            nextSrc={
              lightboxIndex === product.images.length
                ? null
                : product.images[lightboxIndex]
            }
            prevSrc={
              lightboxIndex === 0 ? null : product.images[lightboxIndex - 2]
            }
            onCloseRequest={() => setLightboxOpen(false)}
            onMovePrevRequest={() => setLightboxIndex(lightboxIndex - 1)}
            onMoveNextRequest={() => setLightboxIndex(lightboxIndex + 1)}
          />
        )}
      </div>

      <br />
    </div>
  );
}

export default ProductMag;
