import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

const PostCard = ({ post, index = 0 }) => {
    // Safe defaults
    const title = post.title || 'Untitled';
    const slug = post.slug || post._id || '#';
    const authorName = post.author?.username || 'Unknown Author';
    const snippet = post.content ? post.content.replace(/<[^>]+>/g, '').substring(0, 150) + '...' : 'No content available.';
    const likesCount = post.likes?.length || 0;
    const commentsCount = post.comments?.length || 0;
    const createdAt = post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : '';
    const imageUrl = post.image || post.coverImage;
    const firstTag = post.tags && post.tags.length > 0 ? post.tags[0] : null;

    return (
        <motion.article 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass" 
            style={{ 
                borderRadius: '1.5rem', 
                overflow: 'hidden', 
                display: 'flex', 
                flexDirection: 'column', 
                height: '100%',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            whileHover={{ y: -8, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
        >
            {imageUrl && (
                <Link to={`/post/${slug}`} style={{ display: 'block', overflow: 'hidden', aspectRatio: '16/10', position: 'relative', width: '100%', minHeight: '200px' }}>
                    <motion.img 
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                        src={imageUrl} 
                        alt={title} 
                        loading="lazy"
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    {firstTag && (
                        <span style={{
                            position: 'absolute', top: '1rem', left: '1rem',
                            background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(4px)',
                            padding: '0.25rem 0.75rem', borderRadius: '9999px',
                            fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
                            color: '#0f172a', letterSpacing: '0.05em'
                        }}>
                            {firstTag}
                        </span>
                    )}
                </Link>
            )}

            <div style={{ padding: '1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{authorName}</span>
                    <span style={{ margin: '0 0.5rem' }}>&middot;</span>
                    <span>{createdAt}</span>
                </div>

                <Link to={`/post/${slug}`} style={{ marginBottom: '0.75rem', display: 'block' }}>
                    <h2 style={{ 
                        fontSize: '1.25rem', marginBottom: 0, lineHeight: 1.3, 
                        display: '-webkit-box', WebkitLineClamp: 2, lineClamp: 2, 
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--color-accent)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--color-text)'}
                    >
                        {title}
                    </h2>
                </Link>

                <p style={{ 
                    fontSize: '0.9375rem', color: 'var(--color-text-muted)', 
                    display: '-webkit-box', WebkitLineClamp: 3, lineClamp: 3, 
                    WebkitBoxOrient: 'vertical', overflow: 'hidden', 
                    marginBottom: '1.5rem', flexGrow: 1 
                }}>
                    {snippet}
                </p>

                <div style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', marginTop: 'auto' 
                }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                            <Heart size={16} />
                            <span>{likesCount}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                            <MessageCircle size={16} />
                            <span>{commentsCount}</span>
                        </div>
                    </div>

                    {post.tags && post.tags.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {post.tags.slice(0, 2).map((tag, i) => (
                                <Link key={i} to={`/tag/${tag}`} onClick={(e) => e.stopPropagation()} style={{
                                    fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '1rem',
                                    background: 'rgba(255,255,255,0.05)', color: 'var(--color-text-muted)',
                                    transition: 'background 0.2s ease, color 0.2s ease'
                                }} onMouseEnter={(e) => { e.target.style.background = 'var(--color-primary-dark)'; e.target.style.color = 'white'; }} onMouseLeave={(e) => { e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.color = 'var(--color-text-muted)'; }}>
                                    #{tag}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </motion.article>
    );
};

export default PostCard;
