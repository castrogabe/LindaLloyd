import React, { useEffect, useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { Store } from '../Store';
import { toast } from 'react-toastify';

export default function AboutUsEdit() {
  const [content, setContent] = useState([]);
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get('/api/about', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setContent(data.sections || []); // Ensure data.sections is an array
      } catch (error) {
        console.error(error);
      }
    };
    fetchContent();
  }, [userInfo]);

  const handleTitleChange = (sectionIndex, e) => {
    const newContent = [...content];
    newContent[sectionIndex].title = e.target.value;
    setContent(newContent);
  };

  const handleParagraphChange = (sectionIndex, paragraphIndex, e) => {
    const newContent = [...content];
    newContent[sectionIndex].paragraphs[paragraphIndex] = e.target.value;
    setContent(newContent);
  };

  const handleAddParagraph = (sectionIndex) => {
    const newContent = [...content];
    newContent[sectionIndex].paragraphs.push('');
    setContent(newContent);
  };

  const handleDeleteParagraph = (sectionIndex, paragraphIndex) => {
    const newContent = [...content];
    newContent[sectionIndex].paragraphs.splice(paragraphIndex, 1);
    setContent(newContent);
  };

  const handleAddSection = () => {
    setContent([...content, { title: '', paragraphs: [''] }]);
  };

  const handleDeleteSection = (sectionIndex) => {
    const newContent = [...content];
    newContent.splice(sectionIndex, 1);
    setContent(newContent);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        '/api/about',
        { sections: content },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      setContent(data.sections); // Update the content with the response data
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
        <title>About Us Edit</title>
      </Helmet>
      <br />
      <h1 className='box'>About Us Edit</h1>
      <Form onSubmit={handleSubmit}>
        {content.map((section, sectionIndex) => (
          <div key={sectionIndex} className='mb-4'>
            <Form.Group controlId={`formTitle${sectionIndex}`}>
              <Form.Label>Title {sectionIndex + 1}</Form.Label>
              <Form.Control
                type='text'
                value={section.title}
                onChange={(e) => handleTitleChange(sectionIndex, e)}
              />
              <Button
                variant='danger'
                onClick={() => handleDeleteSection(sectionIndex)}
                className='mt-2'
              >
                Delete Section
              </Button>
            </Form.Group>
            {section.paragraphs.map((paragraph, paragraphIndex) => (
              <Form.Group
                controlId={`formParagraph${sectionIndex}-${paragraphIndex}`}
                key={paragraphIndex}
              >
                <Form.Label>Paragraph {paragraphIndex + 1}</Form.Label>
                <Form.Control
                  as='textarea'
                  rows={3}
                  value={paragraph}
                  onChange={(e) =>
                    handleParagraphChange(sectionIndex, paragraphIndex, e)
                  }
                />
                <Button
                  variant='danger'
                  onClick={() =>
                    handleDeleteParagraph(sectionIndex, paragraphIndex)
                  }
                  className='mt-2'
                >
                  Delete Paragraph
                </Button>
              </Form.Group>
            ))}
            <Button
              onClick={() => handleAddParagraph(sectionIndex)}
              className='mt-2 mr-2'
            >
              Add Paragraph
            </Button>
          </div>
        ))}
        <Button
          variant='success'
          onClick={handleAddSection}
          className='mt-2 mr-2'
        >
          Add Section
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
