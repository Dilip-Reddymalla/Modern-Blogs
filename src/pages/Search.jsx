import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import PostCard from '../components/ui/PostCard';
import { Skeleton } from '../components/ui/Skeleton';
import { Search as SearchIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentQuery = searchParams.get('q') || '';
    const currentType = searchParams.get('type') || 'title';
    
    const [searchInput, setSearchInput] = useState(currentQuery);
    const [searchType, setSearchType] = useState(currentType);
    
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            if (!currentQuery.trim()) {
                setResults([]);
                setHasSearched(false);
                return;
            }

            setIsLoading(true);
            setHasSearched(true);
            try {
                let response;
                if (currentType === 'tag') {
                    // For multiple tags (e.g., "tech, design"), backend array matching usually expects the raw string or specific formatting.
                    // We'll pass the exact query here, stripped of extra spaces.
                    const formattedTagQuery = currentQuery.split(',').map(t => t.trim()).join(',');
                    response = await api.get(`/get/postByTag/${encodeURIComponent(formattedTagQuery)}`);
                } else {
                    response = await api.get(`/get/search?query=${encodeURIComponent(currentQuery)}`);
                }
                setResults(response.data.posts || []);
            } catch (error) {
                console.error('Search failed:', error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [currentQuery, currentType]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            setSearchParams({ q: searchInput, type: searchType });
        } else {
            setSearchParams({});
        }
    };

    return (
        <div className="container" style={{ marginTop: '2rem', minHeight: '80vh' }}>
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '4rem' }}
            >
                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.1 }}>
                    Search <span className="text-gradient">Articles</span>
                </h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                    Find stories by title or explore specific topics.
                </p>

                <div style={{ maxWidth: '600px', margin: '0 auto 1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button 
                        onClick={() => setSearchType('title')}
                        style={{
                            padding: '0.5rem 1.5rem', borderRadius: '9999px', fontWeight: 600, fontSize: '0.875rem',
                            background: searchType === 'title' ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                            color: searchType === 'title' ? '#fff' : 'var(--color-text-muted)',
                            border: '1px solid', borderColor: searchType === 'title' ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                            cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem'
                        }}
                    >
                        Title & Content
                    </button>
                    <button 
                        onClick={() => setSearchType('tag')}
                        style={{
                            padding: '0.5rem 1.5rem', borderRadius: '9999px', fontWeight: 600, fontSize: '0.875rem',
                            background: searchType === 'tag' ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                            color: searchType === 'tag' ? '#fff' : 'var(--color-text-muted)',
                            border: '1px solid', borderColor: searchType === 'tag' ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                            cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem'
                        }}
                    >
                        # Tags
                    </button>
                </div>

                <form onSubmit={handleSearch} style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
                    <input 
                        type="text" 
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder={searchType === 'tag' ? "Search tags (e.g. React, UI, Backend)..." : "Search titles and contents..."}
                        className="input-field"
                        style={{ padding: '1.25rem 1.5rem', paddingRight: '4rem', fontSize: '1.125rem', borderRadius: '9999px', background: 'rgba(255,255,255,0.05)' }}
                    />
                    <button 
                        type="submit" 
                        style={{ 
                            position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)',
                            width: '3rem', height: '3rem', borderRadius: '50%', background: 'var(--color-primary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer',
                            color: 'white'
                        }}
                    >
                        <SearchIcon size={20} />
                    </button>
                </form>
            </motion.div>

            {isLoading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {[1, 2, 3].map(n => <Skeleton key={n} height="400px" borderRadius="1.5rem" />)}
                </div>
            ) : hasSearched ? (
                <div>
                    <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Results for {searchType === 'tag' ? '#' : ''}"{currentQuery}"</h2>
                        <span style={{ color: 'var(--color-text-muted)' }}>{results.length} articles found</span>
                    </div>

                    {results.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                            {results.map((post, i) => (
                                <PostCard key={post._id} post={post} index={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="glass" style={{ padding: '4rem 2rem', textAlign: 'center', borderRadius: '2rem' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--color-text-muted)' }}>
                                <SearchIcon size={40} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>No articles found</h3>
                            <p style={{ color: 'var(--color-text-muted)' }}>Try adjusting your search terms or exploring different tags.</p>
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    );
};

export default Search;
