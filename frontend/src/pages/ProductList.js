import React, { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Row, Col, Button, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import AdminPagination from '../components/AdminPagination';
import SkeletonProductList from '../components/skeletons/SkeletonProductList';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        totalProducts: action.payload.totalProducts, // Include totalProducts in the state
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return {
        ...state,
        loadingCreate: false,
      };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, successDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

export default function ProductList() {
  const [
    {
      loading,
      error,
      products,
      totalProducts, // totalProducts display in h4
      pages,
      loadingCreate,
      loadingDelete,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
    products: [], // Ensure products is initialized as an empty array
  });

  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/products/admin?page=${page}`, {
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

  const createHandler = async () => {
    if (window.confirm('Are you sure to create?')) {
      try {
        dispatch({ type: 'CREATE_REQUEST' });
        const { data } = await axios.post(
          '/api/products',
          {},
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        toast.success('Product created successfully', {
          autoClose: 1000, // Display success message for 1 second
        });
        dispatch({ type: 'CREATE_SUCCESS' });
        navigate(`/admin/product/${data.product._id}`);
      } catch (err) {
        toast.error(getError(err));
        dispatch({
          type: 'CREATE_FAIL',
        });
      }
    }
  };

  const deleteHandler = async (product) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        await axios.delete(`/api/products/${product._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('Product deleted successfully', {
          autoClose: 1000, // Display success message for 1 second
        });
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        toast.error(getError(err));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };

  return (
    <div className='content'>
      <Helmet>
        <title>Product List</title>
      </Helmet>
      <br />
      <Row className='box'>
        <Col md={6}>
          <h4>
            Product List Page (
            {totalProducts !== undefined ? totalProducts : 'Loading...'}{' '}
            Products Database)
          </h4>
        </Col>
        <Col md={6} className='col text-end'>
          <Button type='button' onClick={createHandler}>
            Create New Product
          </Button>
        </Col>
      </Row>
      {loadingCreate && <SkeletonProductList delay={1000} />}
      {loadingDelete && <SkeletonProductList delay={1000} />}
      {loading ? (
        <Row>
          {[...Array(8).keys()].map((i) => (
            <Col key={i} md={12} className='mb-3'>
              <SkeletonProductList delay={1000} />
            </Col>
          ))}
        </Row>
      ) : error ? (
        <MessageBox variant='danger'>{error}</MessageBox>
      ) : (
        <>
          <div className='box'>
            <Table responsive striped bordered className='noWrap'>
              <thead className='thead'>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>QTY</th>
                  <th>PRICE</th>
                  <th>CATEGORY</th>
                  <th>FROM</th>
                  <th>MATERIALS</th>
                  <th>PERIOD</th>
                  <th>MAKER</th>
                  <th>PROVENANCE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      {product._id}
                      <div key={product._id}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className='img-fluid rounded img-thumbnail'
                        />
                        <Link to={`/product/${product.slug}`}></Link>
                      </div>
                    </td>
                    <td>{product.name}</td>
                    <td>{product.countInStock}</td>
                    <td>
                      {product.salePrice ? (
                        <>
                          <span
                            style={{
                              textDecoration: 'line-through',
                              color: 'gray',
                            }}
                          >
                            ${product.price.toFixed(2)}
                          </span>{' '}
                          <span style={{ color: 'red', fontWeight: 'bold' }}>
                            ${product.salePrice.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <>${product.price.toFixed(2)}</>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div>{product.category}</div>
                      {product.categoryImage ? (
                        <img
                          src={product.categoryImage}
                          alt={product.category}
                          style={{
                            width: '50px',
                            height: '50px',
                            objectFit: 'cover',
                            borderRadius: '5px',
                            marginTop: '5px',
                          }}
                        />
                      ) : (
                        product.category
                      )}
                    </td>
                    <td>{product.from}</td>
                    <td>{product.materials}</td>
                    <td>{product.period}</td>
                    <td>{product.maker}</td>
                    <td>{product.provenance ? 'Yes' : 'No'}</td>
                    <td>
                      <Button
                        type='button'
                        variant='primary'
                        onClick={() =>
                          navigate(`/admin/product/${product._id}`)
                        }
                      >
                        Edit
                      </Button>
                      &nbsp;
                      <Button
                        type='button'
                        variant='primary'
                        onClick={() => deleteHandler(product)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Admin Pagination */}
          <AdminPagination
            currentPage={page}
            totalPages={pages}
            isAdmin={true}
          />
          <br />
        </>
      )}
    </div>
  );
}
