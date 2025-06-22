import React, { useEffect, useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { Store } from '../Store';
import { toast } from 'react-toastify';

export default function HomeContentEdit() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [h4Text, setH4Text] = useState([]);
  const [jumbotronImages, setJumbotronImages] = useState([]);
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get('/api/homecontent', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setTitle(data.title);
        setDescription(data.description);
        setH4Text(data.h4Text || []);
        setJumbotronImages(data.jumbotronImages || []);
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch content');
      }
    };
    fetchContent();
  }, [userInfo]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file); // Append multiple files
    });

    try {
      const { data } = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      setJumbotronImages([...jumbotronImages, ...data.urls]); // Append new images
      toast.success('Images uploaded successfully', {
        autoClose: 1000, // Display success message for 1 second
      });
    } catch (error) {
      toast.error('Failed to upload images');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        '/api/homecontent',
        { title, description, h4Text, jumbotronImages },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      setTitle(data.title);
      setDescription(data.description);
      setH4Text(data.h4Text);
      setJumbotronImages(data.jumbotronImages);
      toast.success('Content updated successfully', {
        autoClose: 1000, // Display success message for 1 second
      });
    } catch (error) {
      toast.error('Failed to update content');
    }
  };

  const handleRemoveImage = (index) => {
    setJumbotronImages(jumbotronImages.filter((_, i) => i !== index));
  };

  return (
    <div className='content'>
      <Helmet>
        <title>Edit Home Content</title>
      </Helmet>
      <br />
      <h1 className='box'>Edit Home Content</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId='formTitle'>
          <Form.Label>Title</Form.Label>
          <Form.Control
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId='formDescription'>
          <Form.Label>Description</Form.Label>
          <Form.Control
            as='textarea'
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
        <hr />
        <Form.Group>
          <Form.Label>Jumbotron Images</Form.Label>
          <Form.Control type='file' multiple onChange={handleImageUpload} />

          <div className='uploaded-images'>
            {jumbotronImages.map((image, index) => (
              <div
                key={index}
                style={{ display: 'inline-block', margin: '10px' }}
              >
                <img
                  src={image}
                  alt={`Jumbotron ${index}`}
                  style={{
                    width: '200px', // Increase this value for a larger preview
                    height: 'auto',
                    objectFit: 'cover',
                    borderRadius: '5px',
                  }}
                />
                &nbsp;
                <Button
                  variant='danger'
                  onClick={() => handleRemoveImage(index)}
                  className='mt-2'
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </Form.Group>

        <Button variant='primary' type='submit' className='mt-2'>
          Save Changes
        </Button>
      </Form>
      <br />
    </div>
  );
}
