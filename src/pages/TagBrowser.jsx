import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Hash } from 'lucide-react';
import api from '../api/axios';
import PostCard from '../components/ui/PostCard';
import { SkeletonPostCard } from '../components/ui/Skeleton';
import { motion } from 'framer-motion';

const TagBrowser = () => {
    const { tag } = useParams();
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchByTag = async () => {
            try {
                const response = await api.get(`/get/postByTag/${tag}`);
                setPosts(response.data.posts || []);
            } catch (err) {
                console.warn('Backend not responding', err);
                setPosts([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchByTag();
    }, [tag]);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container" 
            style={{ paddingTop: '5rem', paddingBottom: '6rem' }}
        >
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                style={{ textAlign: 'center', marginBottom: '4rem' }}
            >
                <div style={{ 
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', 
                    width: '80px', height: '80px', borderRadius: '50%', 
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(236, 72, 153, 0.2))',
                    color: 'var(--color-text)', marginBottom: '1.5rem',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <Hash size={40} />
                </div>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'capitalize' }}>
                    <span className="text-gradient">{tag}</span>
                </h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.25rem' }}>Articles matching the tag</p>
            </motion.div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '2.5rem'
            }}>
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => <SkeletonPostCard key={i} />)
                ) : posts.length > 0 ? (
                    posts.map((post, index) => <PostCard key={post._id} post={post} index={index % 3} />)
                ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>
                        No posts found for this tag.
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default TagBrowser;
