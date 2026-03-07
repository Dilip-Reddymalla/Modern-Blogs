import React from 'react';
import { Feather, Twitter, Github, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{ 
            marginTop: 'auto', 
            borderTop: '1px solid rgba(255,255,255,0.05)',
            padding: '3rem 0 1rem 0'
        }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.25rem', marginBottom: '1rem' }}>
                        <Feather size={24} color="var(--color-primary)" />
                        <span className="text-gradient">ModernBlog</span>
                    </div>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                        A modern platform for elegant writing and thoughtful ideas.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Platform</h4>
                    <a href="/" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', transition: 'color 0.2s' }}>All Posts</a>
                    <a href="/" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', transition: 'color 0.2s' }}>Tags</a>
                    <a href="/" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', transition: 'color 0.2s' }}>Authors</a>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Resources</h4>
                    <a href="/" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', transition: 'color 0.2s' }}>Help Center</a>
                    <a href="/" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', transition: 'color 0.2s' }}>Guidelines</a>
                    <a href="/" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', transition: 'color 0.2s' }}>API Docs</a>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <a href="/" aria-label="Twitter" style={{ color: 'var(--color-text-muted)' }}><Twitter size={20} /></a>
                    <a href="/" aria-label="Github" style={{ color: 'var(--color-text-muted)' }}><Github size={20} /></a>
                    <a href="/" aria-label="Linkedin" style={{ color: 'var(--color-text-muted)' }}><Linkedin size={20} /></a>
                </div>
            </div>
            
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                    &copy; {new Date().getFullYear()} ModernBlog. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
