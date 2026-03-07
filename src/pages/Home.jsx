import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import api from '../api/axios';
import PostCard from '../components/ui/PostCard';
import { SkeletonPostCard } from '../components/ui/Skeleton';
import { motion } from 'framer-motion';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await api.get('/get/allposts');
                setPosts(response.data.posts || []);
            } catch (err) {
                console.warn('Backend not responding', err);
                setPosts([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const featuredPost = posts.length > 0 ? posts[0] : null;
    const standardPosts = posts.length > 1 ? posts.slice(1) : [];

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}
        >
            {/* Hero Section */}
            <section style={{ paddingTop: '5rem', paddingBottom: '3rem' }}>
                <div className="container">
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '800px', margin: '0 auto 4rem auto' }}
                    >
                        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
                            Latest F1 news, articles & <span className="text-gradient">insights.</span>
                        </h1>
                        <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                            Discover the latest insights from our community of writers, thinkers, and creators.
                        </p>
                    </motion.div>

                    {isLoading ? (
                        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                            <SkeletonPostCard />
                        </div>
                    ) : featuredPost ? (
                        <motion.div 
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="glass"
                            style={{ 
                                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                                gap: '2rem', borderRadius: '2rem', overflow: 'hidden', maxWidth: '1000px', margin: '0 auto',
                                padding: '1rem', alignItems: 'center'
                            }}
                        >
                            {(featuredPost.image || featuredPost.coverImage) && (
                                <Link to={`/post/${featuredPost.slug || featuredPost._id}`} style={{ overflow: 'hidden', borderRadius: '1.5rem', display: 'block', height: '100%' }}>
                                    <motion.img 
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.5 }}
                                        src={featuredPost.image || featuredPost.coverImage} 
                                        alt={featuredPost.title} 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '300px' }} 
                                    />
                                </Link>
                            )}

                            <div style={{ padding: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                    {featuredPost.tags && featuredPost.tags[0] && (
                                        <span style={{ 
                                            background: 'rgba(99, 102, 241, 0.2)', color: 'var(--color-primary)', 
                                            padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' 
                                        }}>
                                            {featuredPost.tags[0]}
                                        </span>
                                    )}
                                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>&middot;</span>
                                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{new Date(featuredPost.createdAt).toLocaleDateString()}</span>
                                </div>

                                <Link to={`/post/${featuredPost.slug || featuredPost._id}`}>
                                    <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.2 }}>{featuredPost.title}</h2>
                                </Link>

                                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem', lineHeight: 1.6, marginBottom: '2rem', display: '-webkit-box', WebkitLineClamp: 3, lineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {featuredPost.content.replace(/<[^>]+>/g, '')}
                                </p>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                            {featuredPost.author?.username?.charAt(0).toUpperCase() || 'A'}
                                        </div>
                                        <span style={{ fontWeight: 600 }}>{featuredPost.author?.username || 'Unknown'}</span>
                                    </div>

                                    <Link to={`/post/${featuredPost.slug || featuredPost._id}`} className="btn-ghost" style={{ padding: '0.5rem 1rem' }}>
                                        Read <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No articles found. Check back later!</div>
                    )}
                </div>
            </section>

            {/* Recent Posts Grid */}
            <section style={{ paddingBottom: '6rem' }}>
                <div className="container">
                    <div style={{ marginBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Latest Articles</h3>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem' }}>
                        {isLoading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <SkeletonPostCard key={i} />
                            ))
                        ) : standardPosts.length > 0 ? (
                            standardPosts.map((post, i) => (
                                <PostCard key={post._id} post={post} index={i % 3} />
                            ))
                        ) : null}
                    </div>
                </div>
            </section>
        </motion.div>
    );
};

export default Home;
