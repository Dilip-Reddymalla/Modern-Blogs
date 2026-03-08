import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Clock, CheckCircle, FileText, PenSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { Skeleton, SkeletonPostCard } from '../components/ui/Skeleton';

const Dashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('All');

    const [userPosts, setUserPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const response = await api.get('/user/posts'); 
                setUserPosts(response.data.posts || []);
            } catch (err) {
                console.warn('Failed to fetch user posts', err);
                toast.error(err.response?.data?.message || 'Failed to fetch your articles. Is the backend running?');
            } finally {
                setIsLoading(false);
            }
        };
        
        if (user) {
            fetchUserPosts();
        }
    }, [user]);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (isLoading) {
        return (
            <div className="container" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
                {/* Dashboard Header Skeleton */}
                <header style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <Skeleton width="80px" height="80px" borderRadius="50%" />
                        <div>
                            <Skeleton height="40px" width="300px" />
                            <Skeleton height="20px" width="250px" />
                        </div>
                    </div>
                    <Skeleton height="40px" width="120px" />
                </header>

                {/* Stats Grid Skeleton */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
                    <Skeleton height="100px" borderRadius="1.5rem" />
                    <Skeleton height="100px" borderRadius="1.5rem" />
                    <Skeleton height="100px" borderRadius="1.5rem" />
                </div>

                {/* Content Section Skeleton */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '2rem' }}>
                        <Skeleton height="30px" width="150px" />
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Skeleton height="20px" width="40px" />
                            <Skeleton height="20px" width="70px" />
                            <Skeleton height="20px" width="60px" />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <SkeletonPostCard />
                        <SkeletonPostCard />
                        <SkeletonPostCard />
                    </div>
                </div>
            </div>
        );
    }

    const approvedPosts = userPosts.filter(p => p.approvalStatus === 'approved');
    const pendingPosts = userPosts.filter(p => p.approvalStatus === 'pending');

    const displayedPosts = activeTab === 'All' ? userPosts 
                          : activeTab === 'Published' ? approvedPosts 
                          : pendingPosts;

    const tabs = ['All', 'Published', 'Pending'];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="container" 
            style={{ paddingTop: '4rem', paddingBottom: '6rem' }}
        >
            {/* Dashboard Header */}
            <header style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ 
                        width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-primary)', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800 
                    }}>
                        {user.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Welcome back, {user.username}</h1>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>Manage your articles and see your stats.</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/create-post" className="btn-premium" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <PenSquare size={18} /> Write Article
                    </Link>
                </div>
            </header>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
                <motion.div whileHover={{ y: -5 }} className="glass" style={{ padding: '2rem', borderRadius: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '1rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileText size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>{userPosts.length}</div>
                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Total Articles</div>
                    </div>
                </motion.div>

                <motion.div whileHover={{ y: -5 }} className="glass" style={{ padding: '2rem', borderRadius: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '1rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>{approvedPosts.length}</div>
                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Published</div>
                    </div>
                </motion.div>

                <motion.div whileHover={{ y: -5 }} className="glass" style={{ padding: '2rem', borderRadius: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '1rem', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Clock size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>{pendingPosts.length}</div>
                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>In Review</div>
                    </div>
                </motion.div>
            </div>

            {/* Content Section */}
            <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Your Articles</h2>
                    <div style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
                        {tabs.map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{ 
                                    background: 'none', border: 'none', color: activeTab === tab ? 'var(--color-text)' : 'var(--color-text-muted)', 
                                    fontWeight: 600, cursor: 'pointer', padding: '0.5rem', position: 'relative'
                                }}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="activeTabIndicator"
                                        style={{ position: 'absolute', bottom: '-1rem', left: 0, right: 0, height: '2px', background: 'var(--color-primary)' }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <AnimatePresence mode="popLayout">
                        {displayedPosts.length > 0 ? (
                            displayedPosts.map(post => (
                                <motion.div 
                                    key={post._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="glass"
                                    style={{ padding: '1.5rem 2rem', borderRadius: '1rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1 }}>
                                        {(post.image || post.coverImage) ? (
                                            <div style={{ width: '100px', height: '70px', flexShrink: 0, borderRadius: '0.75rem', overflow: 'hidden' }}>
                                                <img 
                                                    src={post.image || post.coverImage} 
                                                    alt="Cover" 
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                                />
                                            </div>
                                        ) : null}
                                        <div>
                                            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.25rem' }}>{post.title}</h3>
                                            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{new Date(post.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                        <span style={{ 
                                            padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
                                            background: post.approvalStatus === 'approved' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                            color: post.approvalStatus === 'approved' ? '#10b981' : '#f59e0b'
                                        }}>
                                            {post.approvalStatus}
                                        </span>
                                        {post.approvalStatus === 'approved' && (
                                            <Link to={`/post/${post.slug || post._id}`} className="btn-ghost" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>View</Link>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}
                            >
                                You haven&apos;t written any articles in this category.
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
