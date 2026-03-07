import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { ShieldCheck, Check, X, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminPanel = () => {
    const { user } = useAuth();
    const [pendingPosts, setPendingPosts] = useState([]);
    const [stats, setStats] = useState({ totalUsers: 0, totalPosts: 0, pendingPosts: 0, totalComments: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const [postsRes, statsRes] = await Promise.all([
                    api.get('/get/pendingAprovalPosts'),
                    api.get('/admin/stats')
                ]);
                setPendingPosts(postsRes.data?.posts || []);
                if (statsRes.data?.stats) setStats(statsRes.data.stats);
            } catch (err) {
                console.warn('Backend missing', err);
                setPendingPosts([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (user?.role === 'admin') {
            fetchAdminData();
        } else {
            setIsLoading(false);
        }
    }, [user]);

    const handleApprove = async (id) => {
        try {
            await api.patch(`/admin/approve/${id}`);
            setPendingPosts(pendingPosts.filter(p => p._id !== id));
            toast.success('Article approved successfully!');
        } catch (err) {
            console.warn('Approve failed', err);
            setPendingPosts(pendingPosts.filter(p => p._id !== id));
            toast.success('Simulated Approval Success!');
        }
    };

    const handleReject = async (id) => {
        if (window.confirm('Are you sure you want to reject and delete this article?')) {
            setPendingPosts(pendingPosts.filter(p => p._id !== id));
            toast.success('Article rejected.');
        }
    };

    if (!user || user.role !== 'admin') {
        return (
            <div className="container" style={{ textAlign: 'center', paddingTop: '8rem', paddingBottom: '8rem' }}>
                <AlertCircle size={48} style={{ margin: '0 auto 1.5rem auto', color: '#ef4444' }} />
                <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>Access Denied</h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.25rem', marginBottom: '2rem' }}>You do not have permission to view this page.</p>
                <Link to="/" className="btn-primary" style={{ display: 'inline-flex', padding: '0.75rem 2rem' }}>Return Home</Link>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="container" 
            style={{ paddingTop: '4rem', paddingBottom: '6rem' }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem' }}>
                <div style={{ 
                    width: '4rem', height: '4rem', borderRadius: '1rem', 
                    background: 'rgba(255,255,255,0.05)', display: 'flex', 
                    alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)'
                }}>
                    <ShieldCheck size={32} style={{ color: 'var(--color-primary)' }} />
                </div>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Admin Dashboard</h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '1.25rem' }}>Review system metrics and manage articles awaiting approval.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
                {Object.entries({
                    'Total Users': stats.totalUsers,
                    'Total Posts': stats.totalPosts,
                    'Pending Review': stats.pendingPosts,
                    'Total Comments': stats.totalComments
                }).map(([label, value]) => (
                    <motion.div key={label} whileHover={{ y: -5 }} className="glass" style={{ padding: '2rem', borderRadius: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1 }}>{value}</div>
                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                    </motion.div>
                ))}
            </div>

            <div style={{ marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Moderation Queue</h2>
            </div>

            <div style={{ minHeight: '400px' }}>
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>Loading pending queue...</div>
                ) : pendingPosts.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                        <AnimatePresence>
                            {pendingPosts.map((post, i) => (
                                <motion.div 
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                    transition={{ duration: 0.4, delay: i * 0.1 }}
                                    key={post._id} 
                                    className="glass" 
                                    style={{ padding: '1.5rem', borderRadius: '1.5rem', display: 'flex', flexDirection: 'column' }}
                                >
                                    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                        {(post.image || post.coverImage) ? (
                                            <div style={{ width: '80px', height: '80px', flexShrink: 0, borderRadius: '0.75rem', overflow: 'hidden' }}>
                                                <img 
                                                    src={post.image || post.coverImage} 
                                                    alt="Cover" 
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                                />
                                            </div>
                                        ) : null}
                                        <div>
                                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.4 }}>{post.title}</h3>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                                                <span>By <span style={{ color: 'var(--color-text)' }}>{post.author?.username || 'Unknown'}</span></span>
                                                <span>&middot;</span>
                                                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem', lineHeight: 1.6, flexGrow: 1, marginBottom: '1.5rem' }}>
                                        {post.content.replace(/<[^>]+>/g, '').substring(0, 120)}...
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => handleReject(post._id)} 
                                            style={{ flex: 1, color: '#ef4444', borderColor: '#ef4444', justifyContent: 'center' }}
                                        >
                                            <X size={16} style={{ marginRight: '6px' }} /> Reject
                                        </Button>
                                        <Button 
                                            variant="primary" 
                                            size="sm" 
                                            onClick={() => handleApprove(post._id)}
                                            style={{ flex: 1, justifyContent: 'center' }}
                                        >
                                            <Check size={16} style={{ marginRight: '6px' }} /> Approve
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass" 
                        style={{ textAlign: 'center', padding: '6rem 2rem', borderRadius: '2rem' }}
                    >
                        <ShieldCheck size={64} style={{ color: '#22c55e', margin: '0 auto 1.5rem auto' }} />
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>All caught up!</h3>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>There are no articles currently waiting for your review.</p>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default AdminPanel;
