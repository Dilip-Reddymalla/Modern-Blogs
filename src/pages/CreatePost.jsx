import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImagePlus, Send } from 'lucide-react';
import api from '../api/axios';
import FormInput from '../components/ui/FormInput';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const CreatePost = () => {
    const [formData, setFormData] = useState({
        title: '',
        tags: '',
        content: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const objectUrl = URL.createObjectURL(file);
            setImagePreview(objectUrl);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.content) {
            toast.error('Title and content are required.');
            return;
        }

        setIsLoading(true);

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('content', `<p>${formData.content.replace(/\n/g, '</p><p>')}</p>`); 

            if (formData.tags) {
                const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
                // Send as array
                tagsArray.forEach((tag, index) => {
                    data.append(`tags[${index}]`, tag);
                });
            }

            if (imageFile) {
                data.append('image', imageFile);
            }

            await api.post('/create/post', data, {
                // headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success('Article submitted for review!');
            navigate('/dashboard');

        } catch (err) {
            toast.error(err.response?.data?.message || 'Error formulating post. Did you include all fields?');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="container" 
            style={{ paddingTop: '4rem', paddingBottom: '6rem' }}
        >
            <div style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Write a new article</h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.25rem' }}>Share your ideas with the world.</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '3rem', alignItems: 'start' }} className="create-layout">
                {/* Left side: content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <FormInput
                        id="title"
                        type="text"
                        placeholder="Article Title..."
                        value={formData.title}
                        onChange={handleInputChange}
                        style={{ fontSize: '2rem', fontWeight: 700, padding: '1.5rem', height: 'auto' }}
                    />

                    <FormInput
                        id="content"
                        type="textarea"
                        placeholder="Write your article..."
                        value={formData.content}
                        onChange={handleInputChange}
                        style={{ minHeight: '500px', fontSize: '1.125rem', lineHeight: 1.8, padding: '1.5rem', resize: 'vertical' }}
                    />
                </div>

                {/* Right side: settings */}
                <div className="glass" style={{ padding: '2rem', borderRadius: '1.5rem', position: 'sticky', top: '6rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Publish Settings</h3>

                    <div style={{ marginBottom: '2rem' }}>
                        <label 
                            htmlFor="image-upload" 
                            style={{ 
                                display: 'block', width: '100%', aspectRatio: '16/9', borderRadius: '1rem', 
                                border: '2px dashed rgba(255,255,255,0.2)', overflow: 'hidden', cursor: 'pointer',
                                transition: 'all 0.3s ease', position: 'relative'
                            }}
                        >
                            {imagePreview ? (
                                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                    <img src={imagePreview} alt="Cover Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <div style={{ 
                                        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', 
                                        alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600,
                                        opacity: 0, transition: 'opacity 0.2s', ':hover': { opacity: 1 }
                                    }}>
                                        Change Image
                                    </div>
                                </div>
                            ) : (
                                <div style={{ 
                                    width: '100%', height: '100%', display: 'flex', flexDirection: 'column', 
                                    alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--color-text-muted)',
                                    background: 'rgba(255,255,255,0.02)'
                                }}>
                                    <ImagePlus size={32} />
                                    <span style={{ fontWeight: 600 }}>Add Cover Image</span>
                                    <small style={{ fontSize: '0.75rem', opacity: 0.7 }}>Recommended 16:9 ratio</small>
                                </div>
                            )}
                        </label>
                        <input
                            type="file"
                            id="image-upload"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                    </div>

                    <FormInput
                        id="tags"
                        label="Tags"
                        placeholder="Design, Tech, Future"
                        value={formData.tags}
                        onChange={handleInputChange}
                        helperText="Comma separated values"
                    />

                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '2rem 0' }}></div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Button type="submit" variant="primary" isLoading={isLoading} style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Send size={18} /> Submit for Review
                        </Button>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', textAlign: 'center', marginTop: '0.5rem' }}>
                            Your post will be placed in a pending state until approved.
                        </p>
                    </div>
                </div>
            </form>

            <style>{`
                @media (max-width: 1024px) {
                    .create-layout { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </motion.div>
    );
};

export default CreatePost;
