import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils';
import { Container, Form, Button, Image, Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import MessageBox from '../components/MessageBox';
import SkeletonProductEdit from '../components/skeletons/SkeletonProductEdit';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return { ...state, loadingUpload: false, errorUpload: '' };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
};

export default function ProductEdit() {
  const navigate = useNavigate();
  const params = useParams();
  const { id: productId } = params;

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoryImage, setCategoryImage] = useState('');
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [from, setFrom] = useState('');
  const [condition, setCondition] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [materials, setMaterials] = useState('');
  const [period, setPeriod] = useState('');
  const [maker, setMaker] = useState('');
  const [provenance, setProvenance] = useState(false);
  const [description, setDescription] = useState('');
  const [isCharish, setIsCharish] = useState(false);
  const [charishLink, setCharishLink] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/products/${productId}`);
        setName(data.name);
        setSlug(data.slug);
        setPrice(data.price);
        setSalePrice(data.salePrice || '');
        setImage(data.image);
        setImages(data.images || []);
        setCategory(data.category?._id || data.category);
        setCountInStock(data.countInStock);
        setFrom(data.from);
        setCondition(data.condition);
        setDimensions(data.dimensions);
        setMaterials(data.materials);
        setPeriod(data.period);
        setMaker(data.maker);
        setProvenance(data.provenance || false);
        setDescription(data.description);
        setIsCharish(data.charishLink ? true : false);
        setCharishLink(data.charishLink || '');
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [productId]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const selectedCategory = isNewCategory ? newCategoryName.trim() : category;

    if (!selectedCategory) {
      toast.error('Please select or enter a category before updating.', {
        autoClose: 1000, // Display success message for 1 second
      });
      return;
    }

    // Add this console.log before making the API request
    console.log('Submitting Product Update:', {
      categoryImage, // Log categoryImage before sending request
      category,
      name,
      image,
      images,
    });

    try {
      dispatch({ type: 'UPDATE_REQUEST' });

      await axios.put(
        `/api/products/${productId}`,
        {
          _id: productId,
          name,
          slug,
          price,
          salePrice: salePrice !== '' ? salePrice : undefined,
          image,
          images,
          category: selectedCategory,
          categoryImage, // ✅ Ensure categoryImage is sent
          from,
          condition,
          dimensions,
          materials,
          period,
          maker,
          provenance,
          countInStock,
          description,
          charishLink: isCharish ? charishLink.trim() : '',
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({ type: 'UPDATE_SUCCESS' });
      toast.success('Product updated successfully', {
        autoClose: 1000, // Display success message for 1 second
      });
      navigate('/admin/products');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };

  const uploadMultipleFilesHandler = async (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      toast.error('No files selected for upload.');
      return;
    }

    const files = Array.from(e.target.files);
    const bodyFormData = new FormData();
    files.forEach((file) => bodyFormData.append('files', file));

    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });

      dispatch({ type: 'UPLOAD_SUCCESS' });

      if (data.urls.length > 0) {
        setImages([...data.urls]);
        setImage(data.urls[0]); // ✅ always set main image
      }

      toast.success('Images uploaded successfully', {
        autoClose: 1000, // Display success message for 1 second
      });
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
    }
  };

  const deleteImageHandler = (fileUrl) => {
    const updatedImages = images.filter((img) => img !== fileUrl);
    setImages(updatedImages);
    if (image === fileUrl && updatedImages.length > 0) {
      setImage(updatedImages.length > 0 ? updatedImages[0] : '');
    } else if (updatedImages.length === 0) {
      setImage('');
    }
    toast.success('Image removed successfully', {
      autoClose: 1000, // Display success message for 1 second
    });
  };

  const uploadCategoryImageHandler = async (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      toast.error('No file selected for upload.');
      return;
    }

    const file = e.target.files[0];

    const formData = new FormData();
    formData.append('image', file);
    formData.append(
      'categoryId',
      isNewCategory ? newCategoryName.trim() : category
    );

    try {
      const { data } = await axios.post('/api/upload/category', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      setCategoryImage(data.image);
      toast.success('Category image uploaded', {
        autoClose: 1000, // Display success message for 1 second
      });
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const deleteCategoryImageHandler = async () => {
    try {
      await axios.put(
        `/api/upload/category/${
          isNewCategory ? newCategoryName.trim() : category
        }/remove-image`,
        {},
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      setCategoryImage('');
      toast.success('Category image removed', {
        autoClose: 1000, // Display success message for 1 second
      });
    } catch (err) {
      toast.error('Error removing category image');
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/products/categories');
        console.log('Fetched Categories:', data); // ✅ Debugging

        if (isMounted) {
          setCategories(data);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();

    return () => {
      isMounted = false; // Cleanup to prevent state update on unmounted component
    };
  }, []);

  useEffect(() => {
    if (!Array.isArray(categories) || categories.length === 0 || !category)
      return;

    const selectedCategory = categories.find((cat) => cat._id === category);
    if (selectedCategory) {
      setCategoryImage(selectedCategory.categoryImage);
    }
  }, [category, categories]);

  return (
    <Container className='small-screen'>
      <Helmet>
        <title>Edit Product {productId}</title>
      </Helmet>
      <br />
      <h4 className='box'>Edit Product {productId}</h4>

      {loading ? (
        <SkeletonProductEdit />
      ) : error ? (
        <MessageBox variant='danger'>{error}</MessageBox>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group className='mb-3' controlId='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='price'>
            <Form.Label>Price</Form.Label>
            <Form.Control
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='salePrice'>
            <Form.Label>Sale Price (Optional)</Form.Label>
            <Form.Control
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='imageUpload'>
            <Form.Label>Upload Product Images</Form.Label>
            <Form.Control
              type='file'
              multiple
              accept='image/*'
              onChange={uploadMultipleFilesHandler}
            />
          </Form.Group>

          {/* Display Uploaded Images */}
          {images.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {images.map((img, index) => (
                <div
                  key={index}
                  style={{
                    position: 'relative',
                    width: '80px',
                    height: '80px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: index === 0 ? '2px solid gold' : '1px solid #ddd',
                  }}
                >
                  <img
                    src={img}
                    alt={`Preview ${index}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <button
                    onClick={() => deleteImageHandler(img)}
                    style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      color: 'red',
                      border: 'none',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <Form.Group className='mb-3' controlId='category'>
            <Form.Label>Category</Form.Label>
            <Row>
              <Col md={8}>
                {!isNewCategory ? (
                  <Form.Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value=''>Select a category</option>
                    {categories.map((cat, index) => (
                      <option key={cat._id || index} value={cat._id}>
                        {cat._id}
                      </option>
                    ))}
                  </Form.Select>
                ) : (
                  <Form.Control
                    type='text'
                    placeholder='Enter new category name'
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    required
                  />
                )}
                <Form.Check
                  type='checkbox'
                  label='Add a new category'
                  checked={isNewCategory}
                  onChange={(e) => {
                    setIsNewCategory(e.target.checked);
                    // Reset values when toggling
                    setCategory('');
                    setNewCategoryName('');
                    setCategoryImage('');
                  }}
                  className='mt-2'
                />
              </Col>
              <Col md={4} className='text-center'>
                {categoryImage && (
                  <Image
                    src={categoryImage}
                    alt='Category Preview'
                    rounded
                    fluid
                    style={{ maxWidth: '100px', border: '1px solid #ddd' }}
                  />
                )}
              </Col>
            </Row>
          </Form.Group>

          <Form.Group className='mb-3' controlId='categoryImageUpload'>
            <Form.Label>Upload Category Image</Form.Label>
            <Form.Control
              type='file'
              accept='image/*'
              onChange={uploadCategoryImageHandler}
            />
          </Form.Group>

          {categoryImage && (
            <div
              style={{
                position: 'relative',
                display: 'inline-block',
                marginBottom: '10px',
              }}
            >
              <Image
                src={categoryImage}
                alt='Category'
                style={{
                  width: '150px',
                  height: '150px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                }}
              />
              <Button
                variant='danger'
                size='sm'
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  borderRadius: '50%',
                  padding: '3px 6px',
                  fontSize: '12px',
                }}
                onClick={deleteCategoryImageHandler}
              >
                ✕
              </Button>
            </div>
          )}

          <Form.Group className='mb-3' controlId='from'>
            <Form.Label>From</Form.Label>
            <Form.Control
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='condition'>
            <Form.Label>Condition</Form.Label>
            <Form.Control
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='dimensions'>
            <Form.Label>Dimensions</Form.Label>
            <Form.Control
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='materials'>
            <Form.Label>Materials</Form.Label>
            <Form.Control
              value={materials}
              onChange={(e) => setMaterials(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='period'>
            <Form.Label>Period</Form.Label>
            <Form.Control
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='maker'>
            <Form.Label>Maker</Form.Label>
            <Form.Control
              value={maker}
              onChange={(e) => setMaker(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='provenance'>
            <Form.Check
              type='checkbox'
              label='Provenance'
              checked={provenance}
              onChange={(e) => setProvenance(e.target.checked)}
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='countInStock'>
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='description'>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as='textarea'
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='charishCheckbox'>
            <Form.Check
              type='checkbox'
              label='Sold on Charish?'
              checked={isCharish}
              onChange={(e) => setIsCharish(e.target.checked)}
            />
          </Form.Group>

          {isCharish && (
            <Form.Group className='mb-3' controlId='charishLink'>
              <Form.Label>Charish Listing URL</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Charish product URL (e.g., https://www.charish.com/... )'
                value={charishLink}
                onChange={(e) => setCharishLink(e.target.value)}
                required={isCharish}
              />
            </Form.Group>
          )}

          <div className='mb-3'>
            <Button disabled={loadingUpdate || loadingUpload} type='submit'>
              {loadingUpdate ? 'Updating...' : 'Update'}
            </Button>
            {loadingUpdate && <SkeletonProductEdit />}
          </div>
        </Form>
      )}
      <br />
    </Container>
  );
}
