import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Badge, Button, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { getError } from '../utils';
import axios from 'axios';
import SearchBox from '../components/SearchBox';

function Header() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const [showSearch, setShowSearch] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };

  const [messagesCount, setMessagesCount] = useState(0);
  const [summaryData, setSummaryData] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userInfo && userInfo.token) {
          const config = {
            headers: { Authorization: `Bearer ${userInfo.token}` },
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
        <Navbar className='header py-3' expand='lg'>
          <ToastContainer position='bottom-center' limit={1} />

          {/* Left-Aligned Search Icon (Desktop) */}
          <div className='d-none d-lg-block search-icon-desktop'>
            <button
              className='icon-button'
              onClick={() => setShowSearch(!showSearch)}
            >
              <i className={showSearch ? 'fas fa-times' : 'fas fa-search'}></i>
            </button>
          </div>

          {/* Show SearchBox when opened */}
          {showSearch && (
            <div className='search-box-container d-lg-block'>
              <SearchBox
                showSearch={showSearch}
                setShowSearch={setShowSearch}
              />
            </div>
          )}

          {/* Centered Logo */}
          <div className='w-100 text-center'>
            <LinkContainer to='/'>
              <Navbar.Brand>
                <img
                  src='/images/logo.png'
                  alt='Linda Lloyd'
                  className='logo-img'
                />
              </Navbar.Brand>
            </LinkContainer>
          </div>

          {/* Mobile Search Icon */}
          <div className='mobile-search-container d-lg-none text-center'>
            <Button
              className='search-icon'
              variant='outline-primary'
              onClick={() => setShowSearch(!showSearch)}
            >
              <i className={showSearch ? 'fas fa-times' : 'fas fa-search'}></i>
            </Button>
          </div>

          {/* Ensure search is only rendered once */}
          {showSearch && (
            <div
              className={`search-box-container ${
                isMobile ? 'd-lg-none' : 'd-lg-block'
              }`}
            >
              <SearchBox
                showSearch={showSearch}
                setShowSearch={setShowSearch}
              />
            </div>
          )}

          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto align-items-center'>
              {/* Conditional Navigation */}
              {isMobile ? (
                <>
                  <LinkContainer to='/about'>
                    <Nav.Link>About Us</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/collections'>
                    <Nav.Link>Collections</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/contact'>
                    <Nav.Link>Contact</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/soldGallery'>
                    <Nav.Link>Sold Gallery</Nav.Link>
                  </LinkContainer>
                </>
              ) : null}

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
                  <i className='fas fa-sign-in-alt'></i> Sign In
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

              <Link to='/cart' className='nav-link cart'>
                <i className='fa fa-shopping-cart'></i>
                {cart.cartItems.length > 0 && (
                  <span className='cart-badge'>
                    {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                  </span>
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
