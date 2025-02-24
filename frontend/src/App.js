import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

// COMPONENTS
import Header from './components/Header';
import BottomHeader from './components/BottomHeader';
import Footer from './components/Footer';
import BottomFooter from './components/BottomFooter';
import AdminRoute from './components/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';

// ADMIN PAGES
import Dashboard from './pages/Dashboard';
import Messages from './pages/Messages';
import OrderList from './pages/OrderList';
import ProductEdit from './pages/ProductEdit';
import ProductList from './pages/ProductList';
import UserEdit from './pages/UserEdit';
import UserList from './pages/UserList';

// PAGES
import AboutUs from './pages/AboutUs';
import Gallery from './pages/Gallery';
import Cart from './pages/Cart'; // step 1
import Contact from './pages/Contact';
import ForgetPassword from './pages/ForgetPassword';
import Home from './pages/Home';
import Order from './pages/Order';
import OrderHistory from './pages/OrderHistory';
import PaymentMethod from './pages/PaymentMethod'; // step 3
import PlaceOrder from './pages/PlaceOrder'; // step 4
import ProductMag from './pages/ProductMag';
import Profile from './pages/Profile';
import ResetPassword from './pages/ResetPassword';
import Search from './pages/Search';
import ShippingAddress from './pages/ShippingAddress'; // step 2
import Signin from './pages/Signin';
import Signup from './pages/Signup';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <BottomHeader />
      <main className='mt-0'>
        <Routes>
          <Route path='/about' element={<AboutUs />} />
          <Route path='/gallery' element={<Gallery />} />
          <Route path='/product/:slug' element={<ProductMag />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/search' element={<Search />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/forget-password' element={<ForgetPassword />} />
          <Route path='/reset-password/:token' element={<ResetPassword />} />
          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path='/placeorder' element={<PlaceOrder />} />
          <Route
            path='/order/:id'
            element={
              <ProtectedRoute>
                <Order />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path='/orderhistory'
            element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            }
          ></Route>
          <Route path='/shipping' element={<ShippingAddress />}></Route>
          <Route path='/payment' element={<PaymentMethod />}></Route>
          {/* Admin Routes */}
          <Route
            path='/admin/dashboard'
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }
          ></Route>
          <Route
            path='/admin/orders'
            element={
              <AdminRoute>
                <OrderList />
              </AdminRoute>
            }
          ></Route>
          <Route
            path='/admin/users'
            element={
              <AdminRoute>
                <UserList />
              </AdminRoute>
            }
          ></Route>
          <Route
            path='/admin/products'
            element={
              <AdminRoute>
                <ProductList />
              </AdminRoute>
            }
          ></Route>
          <Route
            path='/admin/messages'
            element={
              <AdminRoute>
                <Messages />
              </AdminRoute>
            }
          ></Route>
          <Route
            path='/admin/product/:id'
            element={
              <AdminRoute>
                <ProductEdit />
              </AdminRoute>
            }
          ></Route>
          <Route
            path='/admin/user/:id'
            element={
              <AdminRoute>
                <UserEdit />
              </AdminRoute>
            }
          ></Route>

          <Route path='/' element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <BottomFooter />
    </BrowserRouter>
  );
}

export default App;
