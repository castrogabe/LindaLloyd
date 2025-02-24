import { useContext } from 'react';
import { Navbar, Nav, NavDropdown, Badge } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { Store } from '../Store';

const Header = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
  };
  return (
    <header>
      <Navbar className='header' variant='dark' expand='lg'>
        <ToastContainer position='bottom-center' limit={1} />
        <LinkContainer to='/'>
          <Navbar.Brand className='me-auto'>
            <img src='./images/logo1.png' alt='logo'></img>
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='mr-auto  w-100  justify-content-end'>
            <LinkContainer to='/about'>
              <Nav.Link>
                <i className='fas fa-info'></i> About Me
              </Nav.Link>
            </LinkContainer>
            <Link to='/cart' className='nav-link'>
              <i className='fa fa-shopping-cart'></i> Cart
              {cart.cartItems.length > 0 && (
                <Badge pill bg='danger'>
                  {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                </Badge>
              )}
            </Link>
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
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
};

export default Header;
