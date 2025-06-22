import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

// components
import Header from './components/Header';
import BottomHeader from './components/BottomHeader';
import Footer from './components/Footer';
import BottomFooter from './components/BottomFooter';
import AdminRoute from './components/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';

// admin pages
import Dashboard from './pages/Dashboard';
import Messages from './pages/Messages';
import OrderList from './pages/OrderList';
import ProductEdit from './pages/ProductEdit';
import ProductList from './pages/ProductList';
import UserEdit from './pages/UserEdit';
import UserList from './pages/UserList';

// admin edit pages
import AboutUsEdit from './pages/AboutUsEdit';
import DesignEdit from './pages/DesignEdit';
import AskedQuestionsEdit from './pages/AskedQuestionsEdit';
import HomeContentEdit from './pages/HomeContentEdit';
import ProductMagEdit from './pages/ProductMagEdit';

// pages
import AboutUs from './pages/AboutUs';
import AskedQuestions from './pages/AskedQuestions';
import Cart from './pages/Cart'; // step 1
import Contact from './pages/Contact';
import Collections from './pages/Collections';
import Design from './pages/Design';
import ForgetPassword from './pages/ForgetPassword';
import Home from './pages/Home';
import PaymentMethod from './pages/PaymentMethod'; // step 3
import PlaceOrder from './pages/PlaceOrder'; // step 4
import ProductMag from './pages/ProductMag';
import ResetPassword from './pages/ResetPassword';
import Search from './pages/Search';
import ShippingAddress from './pages/ShippingAddress'; // step 2
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import SoldGallery from './pages/SoldGallery';

// user protected pages
import OrderDetails from './pages/OrderDetails';
import OrderHistory from './pages/OrderHistory';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <br />
      <Header />
      <br />
      {/* <BottomHeader /> */}
      <main className='mt-0'>
        <BottomHeader />
        <Routes>
          <Route path='/about' element={<AboutUs />} />
          <Route path='/askedQuestions' element={<AskedQuestions />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/design' element={<Design />} />
          <Route path='/' element={<Home />} />
          <Route path='/collections' element={<Collections />} />
          <Route path='/payment' element={<PaymentMethod />} />
          <Route path='/placeorder' element={<PlaceOrder />} />
          <Route path='/product/:slug' element={<ProductMag />} />
          <Route path='/search' element={<Search />} />
          <Route path='/shipping' element={<ShippingAddress />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/soldGallery' element={<SoldGallery />} />
          <Route path='/forget-password' element={<ForgetPassword />} />
          <Route path='/reset-password/:token' element={<ResetPassword />} />
          {/* Protected Routes */}
          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path='/order/:id'
            element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path='/orderhistory'
            element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            }
          />
          {/* Admin Routes */}
          <Route
            path='/admin/dashboard'
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }
          />
          <Route
            path='/admin/products'
            element={
              <AdminRoute>
                <ProductList />
              </AdminRoute>
            }
          />
          <Route
            path='/admin/orders'
            element={
              <AdminRoute>
                <OrderList />
              </AdminRoute>
            }
          />
          <Route
            path='/admin/users'
            element={
              <AdminRoute>
                <UserList />
              </AdminRoute>
            }
          />
          <Route
            path='/admin/product/:id'
            element={
              <AdminRoute>
                <ProductEdit />
              </AdminRoute>
            }
          />
          <Route
            path='/admin/user/:id'
            element={
              <AdminRoute>
                <UserEdit />
              </AdminRoute>
            }
          />
          <Route
            path='/admin/messages'
            element={
              <AdminRoute>
                <Messages />
              </AdminRoute>
            }
          />
          {/* Content Edit Pages */}
          <Route
            path='/admin/aboutusedit'
            element={
              <AdminRoute>
                <AboutUsEdit />
              </AdminRoute>
            }
          />
          <Route
            path='/admin/designedit'
            element={
              <AdminRoute>
                <DesignEdit />
              </AdminRoute>
            }
          />
          <Route
            path='/admin/askedquestionsedit'
            element={
              <AdminRoute>
                <AskedQuestionsEdit />
              </AdminRoute>
            }
          />
          <Route
            path='/admin/homecontent'
            element={
              <AdminRoute>
                <HomeContentEdit />
              </AdminRoute>
            }
          />
          <Route
            path='/admin/productmagedit'
            element={
              <AdminRoute>
                <ProductMagEdit />
              </AdminRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
      <BottomFooter />
    </BrowserRouter>
  );
}

export default App;
