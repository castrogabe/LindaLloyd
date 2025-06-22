import React, { useEffect, useState, useContext } from 'react';
import { Form, Button, Image } from 'react-bootstrap';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { Store } from '../Store';
import { toast } from 'react-toastify';

export default function AboutUsEdit() {
  const [content, setContent] = useState({
    sections: [],
    jumbotronImage: null,
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

        setContent({
          sections: Array.isArray(data.sections) ? data.sections : [],
          jumbotronImage: data.jumbotronImage || null,
        });
      } catch (error) {
        console.error(error);
        toast.error('Failed to load content', {
          autoClose: 1000,
        });
      }
    };
    fetchContent();
  }, [userInfo]);

  const handleTitleChange = (sectionIndex, e) => {
    const newContent = { ...content };
    newContent.sections[sectionIndex].title = e.target.value;
    setContent(newContent);
  };

  const handleParagraphChange = (sectionIndex, paragraphIndex, e) => {
    const newContent = { ...content };
    newContent.sections[sectionIndex].paragraphs[paragraphIndex] =
      e.target.value;
    setContent(newContent);
  };

  const handleAddSection = () => {
    setContent((prevContent) => ({
      ...prevContent,
      sections: [
        ...prevContent.sections,
        { title: '', paragraphs: [''], images: [] },
      ],
    }));
  };

  const handleJumbotronUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('jumbotronImage', file);

    try {
      const { data } = await axios.put('/api/about/jumbotron', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      setContent({ ...content, jumbotronImage: data.jumbotronImage });
      toast.success('Jumbotron image uploaded successfully', {
        autoClose: 1000,
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload image', {
        autoClose: 1000,
      });
    }
  };

  const handleDeleteJumbotron = async () => {
    try {
      await axios.delete('/api/about/jumbotron', {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });

      setContent({ ...content, jumbotronImage: null });
      toast.success('Jumbotron image deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        '/api/about',
        { sections: content.sections },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      setContent({ ...content, sections: data.sections });
      toast.success('Content updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update content', {
        autoClose: 1000,
      });
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
        {/* Jumbotron Image Upload */}
        <Form.Group className='mt-3'>
          <Form.Label>Upload Jumbotron Image</Form.Label>
          <Form.Control
            type='file'
            accept='image/*'
            onChange={handleJumbotronUpload}
          />
        </Form.Group>
        {/* Display Jumbotron Image with Delete Button */}
        {content.jumbotronImage && (
          <div className='mt-3 text-center'>
            <Image src={content.jumbotronImage.url} alt='Jumbotron' fluid />
            <Button
              variant='danger'
              className='mt-2'
              onClick={handleDeleteJumbotron}
            >
              Delete Jumbotron Image
            </Button>
          </div>
        )}
        <br />
        {/* Ensure `sections` is an array before mapping */}
        {Array.isArray(content.sections) && content.sections.length > 0 ? (
          content.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className='mb-4'>
              <Form.Group controlId={`formTitle${sectionIndex}`}>
                <Form.Label>Title {sectionIndex + 1}</Form.Label>
                <Form.Control
                  type='text'
                  value={section.title}
                  onChange={(e) => handleTitleChange(sectionIndex, e)}
                />
              </Form.Group>

              {section.paragraphs.map((paragraph, paragraphIndex) => (
                <Form.Group
                  key={paragraphIndex}
                  controlId={`formParagraph${sectionIndex}-${paragraphIndex}`}
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
                </Form.Group>
              ))}
            </div>
          ))
        ) : (
          <p>No sections available. Click "Add Section" to create one.</p>
        )}
        <Button variant='success' onClick={handleAddSection} className='mt-2'>
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
