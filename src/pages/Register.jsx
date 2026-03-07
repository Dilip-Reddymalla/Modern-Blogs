import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import api from '../api/axios';
import FormInput from '../components/ui/FormInput';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        bio: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.email || !formData.password) {
            toast.error('Username, email, and password are required.');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters.');
            return;
        }

        setIsLoading(true);
        try {
            await api.post('/auth/register', formData);
            toast.success('Account created successfully! Redirecting...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 8rem)', padding: '2rem 1rem' }}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="glass"
                style={{ width: '100%', maxWidth: '400px', padding: '2.5rem', borderRadius: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            >
                <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--color-primary)' }}>
                    <UserPlus size={40} />
                </div>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Create Account</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Join ModernBlog and start publishing.</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                    <FormInput
                        id="username"
                        label="Username"
                        type="text"
                        placeholder="johndoe"
                        value={formData.username}
                        onChange={handleChange}
                    />

                    <FormInput
                        id="email"
                        label="Email Address"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <FormInput
                        id="password"
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    <FormInput
                        id="bio"
                        label="Short Bio (Optional)"
                        type="text"
                        placeholder="I love writing about tech..."
                        value={formData.bio}
                        onChange={handleChange}
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={isLoading}
                        style={{ width: '100%', marginTop: '0.5rem' }}
                    >
                        Create Account
                    </Button>
                </form>

                <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Sign in</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
