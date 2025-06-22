import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
// components
import Header from './components/Header';
import BottomHeader from './components/BottomHeader';
import Footer from './components/Footer';
import AdminRoute from './components/AdminRoute';
import BottomFooter from './components/BottomFooter';
import ProtectedRoute from './components/ProtectedRoute';

// pages
import Product from './pages/Product';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Gallery from './pages/Gallery';
import Cart from './pages/Cart';
import Signin from './pages/Signin';
import ShippingAddress from './pages/ShippingAddress';
import Signup from './pages/Signup';
import Search from './pages/Search';
import OrderScreen from './pages/Order';
import PlaceOrder from './pages/PlaceOrder';
import PaymentMethod from './pages/PaymentMethod';
import OrderHistory from './pages/OrderHistory';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import ProductEdit from './pages/ProductEdit';
import Order from './pages/Order';
import OrderList from './pages/OrderList';
import UserList from './pages/UserList';
import UserEdit from './pages/UserEdit';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <BottomHeader />
      <ToastContainer />
      <main className='mt-0'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/product/:slug' element={<Product />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/search' element={<Search />} />
          <Route path='/about' element={<AboutUs />} />
          <Route path='/gallery' element={<Gallery />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/signup' element={<Signup />} />
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
          />
          <Route path='/order/:id' element={<OrderScreen />} />
          <Route path='/shipping' element={<ShippingAddress />} />
          <Route path='/payment' element={<PaymentMethod />} />
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
        </Routes>
      </main>
      <Footer />
      <BottomFooter />
    </BrowserRouter>
  );
}

export default App;
