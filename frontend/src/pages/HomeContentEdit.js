import React, { useEffect, useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { Store } from '../Store';
import { toast } from 'react-toastify';

export default function HomeContentEdit() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [jumbotronText, setJumbotronText] = useState([]);
  const [h4Text, setH4Text] = useState([]);
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
        setJumbotronText(data.jumbotronText || []);
        setH4Text(data.h4Text || []);
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch content');
      }
    };
    fetchContent();
  }, [userInfo]);

  const handleJumbotronTextChange = (index, e) => {
    const newText = [...jumbotronText];
    newText[index] = e.target.value;
    setJumbotronText(newText);
  };

  const handleAddJumbotronText = () => {
    setJumbotronText([...jumbotronText, '']);
  };

  const handleDeleteJumbotronText = (index) => {
    const newText = [...jumbotronText];
    newText.splice(index, 1);
    setJumbotronText(newText);
  };

  const handleH4TextChange = (index, e) => {
    const newText = [...h4Text];
    newText[index] = e.target.value;
    setH4Text(newText);
  };

  const handleAddH4Text = () => {
    setH4Text([...h4Text, '']);
  };

  const handleDeleteH4Text = (index) => {
    const newText = [...h4Text];
    newText.splice(index, 1);
    setH4Text(newText);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        '/api/homecontent',
        { title, description, jumbotronText, h4Text },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      setTitle(data.title);
      setDescription(data.description);
      setJumbotronText(data.jumbotronText);
      setH4Text(data.h4Text);
      toast.success('Content updated successfully', {
        autoClose: 1000,
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to update content');
    }
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
            required
          />
        </Form.Group>
        <Form.Group controlId='formDescription'>
          <Form.Label>Description</Form.Label>
          <Form.Control
            as='textarea'
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>
        <hr />
        {h4Text.map((text, index) => (
          <Form.Group controlId={`formH4Text${index}`} key={index}>
            <Form.Label>Subtitle Text {index + 1}</Form.Label>
            <Form.Control
              type='text'
              value={text}
              onChange={(e) => handleH4TextChange(index, e)}
              required
            />
            <Button
              variant='danger'
              onClick={() => handleDeleteH4Text(index)}
              className='mt-2'
            >
              Delete
            </Button>
          </Form.Group>
        ))}
        <Button
          variant='success'
          onClick={handleAddH4Text}
          className='mt-2 mr-2'
        >
          Add Subtitle Text
        </Button>
        <hr />
        {jumbotronText.map((text, index) => (
          <Form.Group controlId={`formJumbotronText${index}`} key={index}>
            <Form.Label>Typewriter Effect Text {index + 1}</Form.Label>
            <Form.Control
              type='text'
              value={text}
              onChange={(e) => handleJumbotronTextChange(index, e)}
              required
            />
            <Button
              variant='danger'
              onClick={() => handleDeleteJumbotronText(index)}
              className='mt-2'
            >
              Delete
            </Button>
          </Form.Group>
        ))}
        <Button
          variant='success'
          onClick={handleAddJumbotronText}
          className='mt-2 mr-2'
        >
          Add Typewriter Effect Text
        </Button>
        &nbsp;
        <Button variant='primary' type='submit' className='mt-2'>
          Save Changes
        </Button>
      </Form>
      <br />
    </div>
  );
}
