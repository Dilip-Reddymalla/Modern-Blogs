import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { AnimatePresence } from 'framer-motion';

import Home from './pages/Home';
import PostReader from './pages/PostReader';
import TagBrowser from './pages/TagBrowser';
import Search from './pages/Search';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/post/:slug" element={<PostReader />} />
        <Route path="/tag/:tag" element={<TagBrowser />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1, paddingBottom: '2rem' }}>
            <AnimatedRoutes />
          </main>
          <Footer />
        </div>
        <Toaster position="bottom-right" 
          toastOptions={{
            style: {
              background: 'var(--bg-secondary)',
              color: 'var(--color-text)',
              border: '1px solid var(--glass-border)',
              borderRadius: '9999px'
            }
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
