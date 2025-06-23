import axios from 'axios';
import React, { useEffect, useContext, useState, useReducer } from 'react';
import { Table, Button, Row, Col, Form } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import AdminPagination from '../components/AdminPagination';
import SkeletonMessage from '../components/skeletons/SkeletonMessage';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        users: action.payload.users,
        totalMessages: action.payload.totalMessages, // Include totalMessages in the state
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    case 'REPLY_SUCCESS':
      return { ...state, replyLoading: false, replySuccess: true };
    case 'REPLY_FAIL':
      return { ...state, replyLoading: false, replyError: action.payload };
    default:
  }
};
export default function Messages() {
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [messages, setMessages] = useState([
    {
      update_time: '',
      fullName: '',
      email: '',
      subject: '',
      message: '',
    },
  ]);
  const [
    { loading, error, loadingDelete, totalMessages, successDelete, pages },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const [replyVisible, setReplyVisible] = useState(false);
  const [replyMessage, setReplyMessage] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  });

  const sendReply = async () => {
    try {
      const response = await axios.post('/api/messages/reply', {
        email: replyMessage.email,
        subject: replyMessage.subject,
        message: replyMessage.replyContent,
      });

      console.log(response.data);
      setReplyVisible(false);
    } catch (error) {
      //  console.error('Error sending reply:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/messages/admin?page=${page}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
        setMessages(data.messages);
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
        console.error('Error fetching messages:', err);
      }
    };

    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete]);

  const deleteHandler = async (messageToDelete) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete('/api/messages', {
          data: {
            update_time: messageToDelete.update_time,
            fullName: messageToDelete.fullName,
            email: messageToDelete.email,
            subject: messageToDelete.subject,
            message: messageToDelete.message,
          },
        });
        toast.success('Message deleted successfully', {
          autoClose: 1500,
        });
        dispatch({ type: 'DELETE_SUCCESS' });

        setMessages((prevMessages) =>
          prevMessages.filter((message) => message.id !== messageToDelete.id)
        );
      } catch (err) {
        toast.error(getError(err));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };

  // MM-DD-YYYY
  function formatDate(dateString) {
    const dateObject = new Date(dateString);
    const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(dateObject.getDate()).padStart(2, '0');
    const year = dateObject.getFullYear();
    return `${month}-${day}-${year}`;
  }

  return (
    <>
      <Helmet>
        <title>Messages</title>
      </Helmet>
      <div className='content'>
        <br />
        <h4 className='box'>
          Messages ({totalMessages !== undefined ? totalMessages : 'Loading...'}
          )
        </h4>
        <div className='box'>
          {loadingDelete && <SkeletonMessage />}
          {loading ? (
            <Row>
              {[...Array(8).keys()].map((i) => (
                <Col key={i} md={12} className='mb-3'>
                  <SkeletonMessage />
                </Col>
              ))}
            </Row>
          ) : error ? (
            <MessageBox variant='danger'>{error}</MessageBox>
          ) : (
            <Table responsive striped bordered className='noWrap'>
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>SUBJECT</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {messages &&
                  messages.map((message) => (
                    <tr key={message}>
                      <td>{formatDate(message.createdAt)}</td>
                      <td>{message.fullName}</td>
                      <td>{message.email}</td>
                      <td>{message.subject}</td>
                      <td>
                        <textarea
                          className='td.message-cell'
                          rows='3' // You can adjust the number of rows as needed
                          cols='40' // width of cell
                          value={message.message}
                          readOnly // Make the text box read-only since you're displaying the message
                        />
                      </td>
                      <td>
                        <Button
                          type='button'
                          variant='primary'
                          onClick={() => {
                            setReplyMessage({
                              fullName: message.fullName,
                              email: message.email,
                              subject: `Re: ${message.subject}`,
                              message: `Dear ${message.fullName},\n\n`,
                            });
                            setReplyVisible(true);
                          }}
                        >
                          Reply
                        </Button>
                      </td>
                      <td>
                        <Button
                          type='button'
                          variant='primary'
                          onClick={() => deleteHandler(message)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          )}
        </div>

        {/* Reply Form/Dialog */}
        {replyVisible && (
          <div className='box'>
            <h2>Reply Email to: {replyMessage.fullName} </h2>
            <Form>
              <Form.Group>
                <Form.Label>
                  Email Address: {replyMessage.email}, Message:{' '}
                  {replyMessage.subject}
                </Form.Label>
                <Form.Control
                  as='textarea'
                  rows={5}
                  value={replyMessage.replyContent}
                  onChange={(e) =>
                    setReplyMessage({
                      ...replyMessage,
                      replyContent: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <br />
              {/* Submit button and close button */}
              <Button
                type='submit'
                variant='primary'
                onClick={sendReply}
                className='send-reply-button'
              >
                Send Reply
              </Button>
              &nbsp;
              <Button
                type='button'
                variant='primary'
                onClick={() => setReplyVisible(false)}
                className='send-reply-button'
              >
                Close
              </Button>
            </Form>
          </div>
        )}

        {/* Admin Pagination */}
        <AdminPagination
          currentPage={page}
          totalPages={pages}
          isAdmin={true}
          keyword='Messages'
        />
        <br />
      </div>
    </>
  );
}
