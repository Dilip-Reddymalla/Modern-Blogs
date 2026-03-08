import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PenSquare, User, Menu, X, Feather, LogOut, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const t = setTimeout(() => setMobileMenuOpen(false), 0);
        return () => clearTimeout(t);
    }, [location.pathname]);

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            style={{
                position: 'sticky', top: 0, zIndex: 50,
                transition: 'all 0.3s ease',
                background: isScrolled ? 'var(--glass-bg)' : 'transparent',
                backdropFilter: isScrolled ? 'var(--glass-blur)' : 'none',
                WebkitBackdropFilter: isScrolled ? 'var(--glass-blur)' : 'none',
                borderBottom: isScrolled ? '1px solid var(--glass-border)' : '1px solid transparent',
                boxShadow: isScrolled ? 'var(--glass-shadow)' : 'none'
            }}
        >
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem' }}>
                {/* Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.25rem' }}>
                    <Feather size={24} color="var(--color-primary)" />
                    <span className="text-gradient">ModernBlog</span>
                </Link>

                {/* Desktop Navigation */}
                <nav style={{ display: 'none', gap: '2rem', alignItems: 'center' }} className="desktop-nav">
                    <Link to="/" style={{ fontWeight: 500, color: location.pathname === '/' ? 'var(--color-text)' : 'var(--color-text-muted)' }}>Articles</Link>
                    <Link to="/search" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: location.pathname === '/search' ? 'var(--color-text)' : 'var(--color-text-muted)', fontWeight: 500 }}>
                        <Search size={18} /> Search
                    </Link>
                </nav>

                {/* Desktop Actions */}
                <div style={{ display: 'none', gap: '1rem', alignItems: 'center' }} className="desktop-actions">
                    {user ? (
                        <>
                            <Link to="/create-post" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}><PenSquare size={18} /> Write</Link>
                            {(user.role === 'admin' || user.role === 'owner') && (
                                <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, color: user.role === 'owner' ? '#a855f7' : '#22c55e' }}>{user.role === 'owner' ? 'Owner' : 'Admin'}</Link>
                            )}
                            <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }}></div>
                            <Link to="/dashboard" title="Go to Dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
                                    {user.username ? user.username.charAt(0).toUpperCase() : <User size={18} />}
                                </div>
                            </Link>
                            <button
                                onClick={() => {
                                    if (window.confirm('Are you sure you want to logout?')) {
                                        logout();
                                    }
                                }}
                                title="Logout"
                                className="btn-ghost"
                                style={{ padding: '0.5rem', color: 'var(--color-text-muted)' }}
                            >
                                <LogOut size={20} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn-ghost" style={{ padding: '0.5rem 1rem' }}>Sign In</Link>
                            <Link to="/register" className="btn-premium" style={{ padding: '0.5rem 1.25rem' }}>Write Article</Link>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="mobile-toggle"
                    style={{ background: 'none', border: 'none', color: 'var(--color-text)', cursor: 'pointer' }}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="glass"
                        style={{ overflow: 'hidden', borderTop: '1px solid var(--glass-border)' }}
                    >
                        <div className="container" style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Link to="/" style={{ fontWeight: 500 }}>Articles</Link>
                            <Link to="/search" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}><Search size={18} /> Search Topics</Link>
                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                            {user ? (
                                <>
                                    <Link to="/create-post" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><PenSquare size={18} /> Write</Link>
                                    {(user.role === 'admin' || user.role === 'owner') && (
                                        <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: user.role === 'owner' ? '#a855f7' : '#22c55e' }}>{user.role === 'owner' ? 'Owner Panel' : 'Admin Panel'}</Link>
                                    )}
                                    <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={18} /> Dashboard</Link>
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Are you sure you want to logout?')) {
                                                logout();
                                            }
                                        }}
                                        style={{ background: 'none', border: 'none', color: 'var(--color-error)', textAlign: 'left', fontWeight: 500, cursor: 'pointer', padding: 0 }}
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                                    <Link to="/login" className="btn-ghost" style={{ justifyContent: 'center' }}>Sign In</Link>
                                    <Link to="/register" className="btn-premium" style={{ justifyContent: 'center' }}>Write Article</Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @media (min-width: 768px) {
                    .desktop-nav { display: flex !important; }
                    .desktop-actions { display: flex !important; }
                    .mobile-toggle { display: none !important; }
                }
            `}</style>
        </motion.header>
    );
};

export default Navbar;
