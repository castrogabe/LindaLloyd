import React, { useEffect, useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { Store } from '../Store';
import { toast } from 'react-toastify';

export default function AskedQuestionsEdit() {
  const [content, setContent] = useState([]);
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get('/api/faqs', {
          // Ensure correct endpoint
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        if (data && data.faqs) {
          setContent(data.faqs);
        } else {
          setContent([]); // Set to empty array if data or data.faqs is null/undefined
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchContent();
  }, [userInfo]);

  const handleQuestionChange = (faqIndex, e) => {
    const newContent = [...content];
    newContent[faqIndex].question = e.target.value;
    setContent(newContent);
  };

  const handleAnswerChange = (faqIndex, e) => {
    const newContent = [...content];
    newContent[faqIndex].answer = e.target.value;
    setContent(newContent);
  };

  const handleAddFaq = () => {
    setContent([...content, { question: '', answer: '' }]);
  };

  const handleDeleteFaq = (faqIndex) => {
    const newContent = [...content];
    newContent.splice(faqIndex, 1);
    setContent(newContent);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        '/api/faqs', // Ensure correct endpoint
        { faqs: content },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      setContent(data.faqs); // Update the content with the response data
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
        <title>Asked Questions Edit</title>
      </Helmet>
      <br />
      <h1 className='box'>Asked Questions Edit</h1>
      <Form onSubmit={handleSubmit}>
        {content.length > 0 ? (
          content.map((faq, faqIndex) => (
            <div key={faqIndex} className='mb-4'>
              <Form.Group controlId={`formQuestion${faqIndex}`}>
                <Form.Label>Question {faqIndex + 1}</Form.Label>
                <Form.Control
                  type='text'
                  value={faq.question}
                  onChange={(e) => handleQuestionChange(faqIndex, e)}
                />
              </Form.Group>
              <Form.Group controlId={`formAnswer${faqIndex}`}>
                <Form.Label>Answer {faqIndex + 1}</Form.Label>
                <Form.Control
                  as='textarea'
                  rows={3}
                  value={faq.answer}
                  onChange={(e) => handleAnswerChange(faqIndex, e)}
                />
                <Button
                  variant='danger'
                  onClick={() => handleDeleteFaq(faqIndex)}
                  className='mt-2'
                >
                  Delete FAQ
                </Button>
              </Form.Group>
            </div>
          ))
        ) : (
          <p>No FAQs available</p>
        )}
        <Button variant='success' onClick={handleAddFaq} className='mt-2 mr-2'>
          Add FAQ
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
