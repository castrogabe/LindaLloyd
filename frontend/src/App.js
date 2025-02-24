import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Gallery from './pages/Gallery';
import Header from './components/Header';
import BottomHeader from './components/BottomHeader';
import BottomFooter from './components/BottomFooter';
import Footer from './components/Footer';
import Product from './pages/Product';
import Cart from './pages/Cart';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Signin from './pages/Signin';

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
          <Route path='/about' element={<AboutUs />} />
          <Route path='/gallery' element={<Gallery />} />
          <Route path='/signin' element={<Signin />} />
        </Routes>
      </main>
      <Footer />
      <BottomFooter />
    </BrowserRouter>
  );
}

export default App;
