import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
    children,
    variant = 'primary', // primary or ghost
    isLoading = false,
    icon = null,
    className = '',
    ...props
}) => {
    const baseClass = variant === 'primary' ? 'btn-premium' : 'btn-ghost';

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className={`${baseClass} ${className}`}
            disabled={isLoading || props.disabled}
            style={{ opacity: isLoading ? 0.7 : 1, position: 'relative' }}
            {...props}
        >
            {isLoading ? (
                <span className="btn-spinner" style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: '1.25em', height: '1.25em', border: '2px solid rgba(255,255,255,0.3)',
                    borderRadius: '50%', borderTopColor: 'currentColor', animation: 'spin 0.8s linear infinite'
                }}></span>
            ) : icon ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>{icon} {children}</span>
            ) : (
                <span style={{ opacity: isLoading ? 0 : 1 }}>{children}</span>
            )}
            
            {/* Adding the spin keyframes inline using a style tag just for the spinner if needed, but we can put it in index.css */}
            <style>{`
                @keyframes spin { to { transform: translate(-50%, -50%) rotate(360deg); } }
            `}</style>
        </motion.button>
    );
};

export default Button;
