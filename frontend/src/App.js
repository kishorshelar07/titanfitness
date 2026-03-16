import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect }        from 'react';
import { AppProvider }      from './context/AppContext';

// Styles
import './styles/variables.css';
import './styles/global.css';
import './styles/animations.css';

// Components
import Navbar               from './components/Navbar';
import Footer               from './components/Footer';
import Loader               from './components/Loader';
import ToastNotification    from './components/ToastNotification';
import { ScrollToTop, WhatsAppFloatingButton } from './components/FloatingButtons';

// Pages
import Home                 from './pages/Home';
import About                from './pages/About';
import Programs             from './pages/Programs';
import Trainers             from './pages/Trainers';
import Membership           from './pages/Membership';
import Gallery              from './pages/Gallery';
import Testimonials         from './pages/Testimonials';
import { Blog, BlogPost }   from './pages/Blog';
import Contact              from './pages/Contact';
import Admin                from './pages/Admin';

// Scroll to top on route change
const ScrollReset = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// Layout wrapper (hides Navbar/Footer on Admin page)
const Layout = ({ children }) => {
  const { pathname } = useLocation();
  const isAdmin = pathname === '/admin';

  return (
    <>
      {!isAdmin && <Navbar />}
      <div style={{ paddingTop: isAdmin ? 0 : '0px' }}>
        {children}
      </div>
      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppFloatingButton />}
      {!isAdmin && <ScrollToTop />}
    </>
  );
};

const AppRoutes = () => (
  <Layout>
    <ScrollReset />
    <Routes>
      <Route path="/"              element={<Home />}         />
      <Route path="/about"         element={<About />}        />
      <Route path="/programs"      element={<Programs />}     />
      <Route path="/trainers"      element={<Trainers />}     />
      <Route path="/membership"    element={<Membership />}   />
      <Route path="/gallery"       element={<Gallery />}      />
      <Route path="/testimonials"  element={<Testimonials />} />
      <Route path="/blog"          element={<Blog />}         />
      <Route path="/blog/:slug"    element={<BlogPost />}     />
      <Route path="/contact"       element={<Contact />}      />
      <Route path="/admin"         element={<Admin />}        />
      {/* 404 */}
      <Route path="*" element={
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px', textAlign: 'center', padding: '0 6%' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '8rem', fontWeight: 700, background: 'var(--gradient-fire)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>404</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', textTransform: 'uppercase', letterSpacing: '3px' }}>Page Not Found</h2>
          <a href="/" className="btn-primary" style={{ marginTop: '10px' }}>← Back to Home</a>
        </div>
      } />
    </Routes>
  </Layout>
);

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Loader />
        <ToastNotification />
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
