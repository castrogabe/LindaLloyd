import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Badge, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { getError } from '../utils';
import axios from 'axios';
import SearchBox from '../components/SearchBox';

function Header() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };
  const [categories, setCategories] = useState([]);
  const [messagesCount, setMessagesCount] = useState(0);
  const [summaryData, setSummaryData] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userInfo && userInfo.token) {
          const config = {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          };
          const messagesResponse = await axios.get('/api/messages', config);
          setMessagesCount(messagesResponse.data.length);

          const summaryResponse = await axios.get(
            '/api/orders/summary',
            config
          );
          setSummaryData(summaryResponse.data.orders);
        }
      } catch (err) {
        toast.error(getError(err));
      }
    };

    fetchData();
  }, [userInfo]);

  return (
    <>
      <header>
        <Navbar className='header' variant='light' expand='lg'>
          <ToastContainer position='bottom-center' limit={1} />
          <LinkContainer to='/'>
            <Navbar.Brand className='me-auto'>
              {/* fix logo from breaking by removing . */}
              <img src='/images/logo.png' alt='logo'></img>
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='mr-auto  w-100  justify-content-end'>
              {/* Center items - Search Box */}
              <div className='mx-auto'>
                <SearchBox />
              </div>

              <NavDropdown title='About Us' id='basic-nav-dropdown'>
                <NavDropdown.Item href='/about'>About Us</NavDropdown.Item>
                <NavDropdown.Item href='/contact'>Contact Us</NavDropdown.Item>
                <NavDropdown.Item href='/design'>Design</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href='/askedQuestions'>FAQ</NavDropdown.Item>
              </NavDropdown>

              {/* Categories on mobile */}
              <NavDropdown
                className='nav-categories'
                title='Categories'
                id='basic-nav-dropdown'
              >
                <Nav className='flex-column p-2'>
                  {categories.map((category) => (
                    <Nav.Item key={category}>
                      <LinkContainer to={`/search?category=${category}`}>
                        <Nav.Link className='text-dark'>{category}</Nav.Link>
                      </LinkContainer>
                    </Nav.Item>
                  ))}
                </Nav>
              </NavDropdown>

              {userInfo ? (
                <NavDropdown title={userInfo.name} id='basic-nav-dropdown'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>User Profile</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/orderhistory'>
                    <NavDropdown.Item>Order History</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider />
                  <Link
                    className='dropdown-item'
                    to='#signout'
                    onClick={signoutHandler}
                  >
                    Sign Out
                  </Link>
                </NavDropdown>
              ) : (
                <Link className='nav-link' to='/signin'>
                  <i class='fas fa-sign-in-alt'></i> Sign In
                </Link>
              )}

              {userInfo && userInfo.isAdmin && (
                <NavDropdown title='Admin' id='admin-nav-dropdown'>
                  <LinkContainer to='/admin/dashboard'>
                    <NavDropdown.Item>Dashboard</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/products'>
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/users'>
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to='/admin/orders'>
                    <NavDropdown.Item>
                      Orders{' '}
                      {summaryData && summaryData[0] && (
                        <Badge pill bg='success'>
                          {summaryData[0].numOrders}
                        </Badge>
                      )}
                    </NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to='/admin/messages'>
                    <NavDropdown.Item>
                      Messages{' '}
                      {messagesCount > 0 && (
                        <Badge pill bg='success'>
                          {messagesCount}
                        </Badge>
                      )}
                    </NavDropdown.Item>
                  </LinkContainer>

                  {/* Admin Edit Pages */}
                  <NavDropdown
                    className='nav-dropdown-success'
                    title='Edit Pages'
                    id='edit-pages-nav-dropdown'
                  >
                    <LinkContainer to='/admin/aboutusedit'>
                      <NavDropdown.Item>About Us Edit</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/admin/askedquestionsedit'>
                      <NavDropdown.Item>FAQ Questions Edit</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/admin/designedit'>
                      <NavDropdown.Item>Design Edit</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/admin/homecontent'>
                      <NavDropdown.Item>Home Edit</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/admin/productmagedit'>
                      <NavDropdown.Item>ProductMag Edit</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                </NavDropdown>
              )}

              <Link to='/cart' className='nav-link'>
                <i className='fa fa-shopping-cart'></i> Cart
                {cart.cartItems.length > 0 && (
                  <Badge pill bg='danger'>
                    {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                  </Badge>
                )}
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </header>
    </>
  );
}

export default Header;
