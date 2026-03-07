import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Heart, MessageCircle, Share2, BookmarkPlus, Trash2, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Skeleton } from '../components/ui/Skeleton';
import { motion, useScroll, useSpring } from 'framer-motion';
import Button from '../components/ui/Button';

const PostReader = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [likesCount, setLikesCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [commentText, setCommentText] = useState('');
    
    // Reading progress bar setup
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await api.get(`/get/post/${slug}`);
                setPost(response.data.post);
                setLikesCount(response.data.post.likes?.length || 0);
                setIsLiked(user ? response.data.post.likes?.some(l => l._id === user.id) : false);
            } catch (err) {
                console.warn('Backend missing', err);
                setPost(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPost();
        window.scrollTo(0, 0); // Scroll to top on load
    }, [slug, user]);

    const handleLike = async () => {
        if (!user) return alert('Please login to like this post');

        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);

        try {
            await api.patch(`/interaction/toggleLike/${post._id}`);
        } catch (err) {
            console.warn('Toggle like failed', err);
            setIsLiked(isLiked);
            setLikesCount(prev => isLiked ? prev + 1 : prev - 1);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!user) return alert('Please login to comment');
        if (!commentText.trim()) return;

        try {
            const response = await api.patch(`/interaction/${post._id}/addComment`, { message: commentText });
            if (response.status === 200) {
                if (response.data.comments) {
                    setPost(prev => ({ ...prev, comments: response.data.comments }));
                } else if (response.data.post) {
                    setPost(response.data.post);
                } else {
                    const postRes = await api.get(`/get/post/${slug}`);
                    setPost(postRes.data.post);
                }
                setCommentText('');
                toast.success('Comment added!');
            }
        } catch (err) {
            console.error('Comment failed', err);
            toast.error(err.response?.data?.message || 'Failed to add comment');
        }
    };

    const handleDeletePost = async () => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            if (user?.role === 'admin') {
                await api.delete(`/admin/post/${post._id}`);
            } else {
                await api.delete(`/create/post/${post._id}`);
            }
            toast.success("Post deleted successfully");
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete post");
        }
    };

    const handleEditPost = () => {
        toast.error("Edit post feature is not active yet.");
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return;
        try {
            const res = await api.patch(`/interaction/${post._id}/deleteComment/${commentId}`);
            if (res.status === 200) {
                if (res.data.comments) {
                    setPost(prev => ({ ...prev, comments: res.data.comments }));
                } else if (res.data.post) {
                    setPost(res.data.post);
                } else {
                    const postRes = await api.get(`/get/post/${slug}`);
                    setPost(postRes.data.post);
                }
                toast.success("Comment deleted");
            }
        } catch (err) {
            toast.error("Failed to delete comment");
        }
    };

    const handleEditComment = async (commentId, oldText) => {
        const newText = window.prompt("Edit your comment:", oldText);
        if (!newText || newText === oldText) return;
        try {
            const res = await api.patch(`/interaction/${post._id}/editComment/${commentId}`, { text: newText });
            if (res.status === 200) {
                if (res.data.comments) {
                    setPost(prev => ({ ...prev, comments: res.data.comments }));
                } else if (res.data.post) {
                    setPost(res.data.post);
                } else {
                    const postRes = await api.get(`/get/post/${slug}`);
                    setPost(postRes.data.post);
                }
                toast.success("Comment updated");
            }
        } catch (err) {
            toast.error("Failed to edit comment");
        }
    };

    if (isLoading) {
        return (
            <div className="container" style={{ marginTop: '4rem', maxWidth: '800px' }}>
                <Skeleton height="3rem" width="80%" className="mb-4" />
                <Skeleton height="1.5rem" width="40%" className="mb-8" />
                <Skeleton height="400px" className="mb-8" borderRadius="1.5rem" />
                <Skeleton height="1rem" className="mb-2" />
                <Skeleton height="1rem" className="mb-2" />
                <Skeleton height="1rem" width="80%" className="mb-6" />
            </div>
        );
    }

    if (!post) {
        return <div className="container" style={{ marginTop: '4rem' }}><h1>Post not found</h1></div>;
    }

    return (
        <>
            <motion.div
                style={{ scaleX, position: 'fixed', top: 0, left: 0, right: 0, height: '4px', background: 'var(--color-primary)', transformOrigin: '0%', zIndex: 100 }}
            />
            
            <motion.article 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ paddingBottom: '6rem' }}
            >
                {/* Article Header */}
                <header className="container" style={{ maxWidth: '800px', margin: '4rem auto 3rem auto', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                        <Link to="/" style={{ fontWeight: 600, color: 'var(--color-text)' }}>{post.author?.username}</Link>
                        <span>&middot;</span>
                        <span>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</span>
                    </div>

                    <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '2rem' }}>
                        {post.title}
                    </h1>

                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem' }}>
                        {post.tags?.map(tag => (
                            <Link key={tag} to={`/tag/${tag}`} style={{ 
                                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                padding: '0.375rem 1rem', borderRadius: '9999px', fontSize: '0.875rem', transition: 'all 0.2s'
                            }}>
                                {tag}
                            </Link>
                        ))}
                    </div>

                    {(user?.role === 'admin' || user?.username === post.author?.username) && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                            {user?.username === post.author?.username && (
                                <button onClick={handleEditPost} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-text)', padding: '0.5rem 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <Edit2 size={16} /> Edit Post
                                </button>
                            )}
                            <button onClick={handleDeletePost} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--color-error)', padding: '0.5rem 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <Trash2 size={16} /> Delete Post
                            </button>
                        </div>
                    )}
                </header>

                {/* Cover Image */}
                {(post.image || post.coverImage) && (
                    <div className="container" style={{ maxWidth: '1000px', margin: '0 auto 4rem auto' }}>
                        <motion.img 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            src={post.image || post.coverImage} alt={post.title} 
                            style={{ width: '100%', height: 'auto', maxHeight: '600px', objectFit: 'cover', borderRadius: '2rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }} 
                        />
                    </div>
                )}

                {/* Article Content & Layout */}
                <div className="container" style={{ maxWidth: '1000px', display: 'flex', gap: '4rem', margin: '0 auto' }}>
                    
                    {/* Desktop Actions */}
                    <aside style={{ width: '60px', flexShrink: 0, display: 'none' }} className="reader-desktop-actions">
                        <div style={{ position: 'sticky', top: '8rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
                            <motion.button 
                                whileTap={{ scale: 0.9 }}
                                onClick={handleLike}
                                style={{ background: 'none', border: 'none', color: isLiked ? 'var(--color-error)' : 'var(--color-text)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}
                            >
                                <Heart fill={isLiked ? 'var(--color-error)' : 'none'} size={28} />
                                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{likesCount}</span>
                            </motion.button>
                            <motion.button 
                                whileTap={{ scale: 0.9 }}
                                onClick={() => document.getElementById('comments').scrollIntoView({ behavior: 'smooth' })}
                                style={{ background: 'none', border: 'none', color: 'var(--color-text)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}
                            >
                                <MessageCircle size={28} />
                                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{post.comments?.length || 0}</span>
                            </motion.button>
                            <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)', margin: '0.5rem 0' }}></div>
                            <button style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}><Share2 size={24} /></button>
                            <button style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}><BookmarkPlus size={24} /></button>
                        </div>
                    </aside>

                    <main style={{ flexGrow: 1, maxWidth: '720px' }}>
                        {/* HTML rendered content */}
                        <div
                            style={{ 
                                color: 'var(--color-text)', 
                                fontSize: '1.125rem', 
                                lineHeight: 1.8 
                            }}
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        <div style={{ margin: '4rem 0', height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>

                        {/* Mobile Actions */}
                        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem' }} className="reader-mobile-actions">
                            <motion.button whileTap={{ scale: 0.9 }} onClick={handleLike} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: isLiked ? 'var(--color-error)' : 'var(--color-text)', cursor: 'pointer', fontWeight: 600 }}>
                                <Heart fill={isLiked ? 'var(--color-error)' : 'none'} size={24} /> <span>{likesCount}</span>
                            </motion.button>
                            <motion.button whileTap={{ scale: 0.9 }} onClick={() => document.getElementById('comments').scrollIntoView({ behavior: 'smooth' })} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--color-text)', cursor: 'pointer', fontWeight: 600 }}>
                                <MessageCircle size={24} /> <span>{post.comments?.length || 0}</span>
                            </motion.button>
                            <div style={{ flexGrow: 1 }}></div>
                            <button style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}><Share2 size={24} /></button>
                        </div>

                        {/* Comments Section */}
                        <section id="comments">
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem' }}>Responses ({post.comments?.length || 0})</h3>

                            {user ? (
                                <form onSubmit={handleCommentSubmit} style={{ marginBottom: '3rem' }}>
                                    <textarea
                                        className="input-field"
                                        style={{ minHeight: '100px', resize: 'vertical', marginBottom: '1rem' }}
                                        placeholder="What are your thoughts?"
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        rows={3}
                                    ></textarea>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button type="submit" variant="primary">Respond</Button>
                                    </div>
                                </form>
                            ) : (
                                <div className="glass" style={{ padding: '2rem', borderRadius: '1rem', textAlign: 'center', marginBottom: '3rem' }}>
                                    <p style={{ marginBottom: '1rem', color: 'var(--color-text-muted)' }}>Join the conversation</p>
                                    <Link to="/login" className="btn-ghost">Log in to comment</Link>
                                </div>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                {post.comments?.slice().reverse().map(comment => {
                                    const isCommentAuthor = user?.username === comment.user?.username;
                                    const isAdmin = user?.role === 'admin';
                                    
                                    return (
                                        <div key={comment._id} style={{ paddingBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                        {comment.user?.username ? comment.user.username.charAt(0).toUpperCase() : '?'}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 600 }}>{comment.user?.username || 'Unknown'}</div>
                                                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                                                            {comment.createdAt ? format(new Date(comment.createdAt), 'MMM d, yyyy') : 'Just now'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    {isCommentAuthor && (
                                                        <button onClick={() => handleEditComment(comment._id, comment.text)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '0.25rem' }} title="Edit Comment">
                                                            <Edit2 size={16} />
                                                        </button>
                                                    )}
                                                    {(isAdmin || isCommentAuthor) && (
                                                        <button onClick={() => handleDeleteComment(comment._id)} style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer', padding: '0.25rem' }} title="Delete Comment">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <p style={{ color: 'var(--color-text)', lineHeight: 1.6 }}>{comment.text}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    </main>
                </div>
            </motion.article>

            <style>{`
                @media (min-width: 1024px) {
                    .reader-desktop-actions { display: block !important; }
                    .reader-mobile-actions { display: none !important; }
                }
            `}</style>
        </>
    );
};

export default PostReader;
