import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import AdminPagination from '../components/AdminPagination';
import SkeletonUserList from '../components/skeletons/SkeletonUserList';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        users: action.payload.users,
        totalUsers: action.payload.totalUsers,
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
    default:
      return state;
  }
};

export default function UserList() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;
  const [
    { loading, error, users, totalUsers, loadingDelete, successDelete, pages },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
    users: [],
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/users/admin?page=${page}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete]);

  const deleteHandler = async (user) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`/api/users/${user._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('User deleted successfully', {
          autoClose: 1000,
        });
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (error) {
        toast.error(getError(error));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };

  const [emailList, setEmailList] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [products, setProducts] = useState([
    { file: null, description: '', price: '' },
  ]);
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    if (users.length > 0) {
      const emails = users.map((user) => user.email).join(', ');
      setEmailList(emails);
    }
  }, [users]);

  const handleProductChange = (index, key, value) => {
    const newProducts = [...products];
    newProducts[index][key] = value;
    setProducts(newProducts);
  };

  const addProduct = () => {
    setProducts([...products, { file: null, description: '', price: '' }]);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('emailList', emailList);
    formData.append('emailSubject', emailSubject);
    formData.append('emailMessage', emailMessage);
    if (logoFile) {
      formData.append('logoFile', logoFile); // Add logo file to form data if available
    }
    products.forEach((product, index) => {
      if (product.file) {
        formData.append('emailFiles', product.file);
        formData.append('descriptions', product.description);
        formData.append('prices', product.price);
      }
    });

    console.log(formData.getAll('descriptions'), formData.getAll('prices')); // Debugging

    try {
      const { data } = await axios.post('/api/emails/mass-email', formData, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(data.message, {
        autoClose: 1000,
      });
    } catch (error) {
      toast.error(getError(error), {
        autoClose: 1000,
      });
    }
  };

  return (
    <div className='content'>
      <Helmet>
        <title>Users</title>
      </Helmet>
      <br />
      <h4 className='box'>
        Users ({totalUsers !== undefined ? totalUsers : 'Loading...'})
      </h4>
      <div className='box'>
        {loadingDelete && <SkeletonUserList delay={1000} />}
        {loading ? (
          <SkeletonUserList delay={1000} />
        ) : error ? (
          <MessageBox variant='danger'>{error}</MessageBox>
        ) : (
          <Table responsive striped bordered className='noWrap'>
            <thead className='thead'>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>IS ADMIN</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.isAdmin ? 'YES' : 'NO'}</td>
                  <td>
                    <Button
                      type='button'
                      variant='primary'
                      onClick={() => navigate(`/admin/user/${user._id}`)}
                    >
                      Edit
                    </Button>
                    &nbsp;
                    <Button
                      type='button'
                      variant='primary'
                      onClick={() => deleteHandler(user)}
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

      {/* Form for mass emails */}
      <div className='box'>
        <h5>Send Mass Email</h5>
        <Form onSubmit={handleEmailSubmit}>
          <Form.Group controlId='emailList'>
            <Form.Label>Email List</Form.Label>
            <Form.Control
              as='textarea'
              rows={3}
              placeholder='Enter email addresses separated by commas'
              value={emailList}
              onChange={(e) => setEmailList(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId='emailSubject'>
            <Form.Label>Email Subject</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter email subject'
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId='emailMessage'>
            <Form.Label>Email Message</Form.Label>
            <Form.Control
              as='textarea'
              rows={3}
              placeholder='Enter email message'
              value={emailMessage}
              onChange={(e) => setEmailMessage(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId='logoFile'>
            <Form.Label>Attach Logo Image</Form.Label>
            <Form.Control
              type='file'
              accept='image/jpeg,image/png'
              onChange={(e) => setLogoFile(e.target.files[0])}
            />
          </Form.Group>

          {products.map((product, index) => (
            <div key={index}>
              <Form.Group controlId={`emailFile${index}`}>
                <Form.Label>Attach Image for Product {index + 1}</Form.Label>
                <Form.Control
                  type='file'
                  accept='image/jpeg,image/png'
                  onChange={(e) =>
                    handleProductChange(index, 'file', e.target.files[0])
                  }
                />
              </Form.Group>
              <Form.Group controlId={`description${index}`}>
                <Form.Label>Description for Product {index + 1}</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter description'
                  value={product.description}
                  onChange={(e) =>
                    handleProductChange(index, 'description', e.target.value)
                  }
                  required
                />
              </Form.Group>
              <Form.Group controlId={`price${index}`}>
                <Form.Label>Price for Product {index + 1}</Form.Label>
                <Form.Control
                  type='number'
                  placeholder='Enter price'
                  value={product.price}
                  onChange={(e) =>
                    handleProductChange(index, 'price', e.target.value)
                  }
                  required
                />
              </Form.Group>
            </div>
          ))}

          <Button type='button' variant='secondary' onClick={addProduct}>
            Add Another Product
          </Button>

          <br />
          <Button type='submit' variant='primary' className='mt-3'>
            Send Email
          </Button>
        </Form>
      </div>

      {/* Admin Pagination */}
      <AdminPagination
        currentPage={page}
        totalPages={pages}
        isAdmin={true}
        keyword='UserList'
      />
      <br />
    </div>
  );
}
