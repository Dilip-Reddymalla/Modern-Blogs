import React from 'react';

export const Skeleton = ({ width, height, borderRadius, className = '' }) => {
    const style = {
        width: width || '100%',
        height: height || '1rem',
        borderRadius: borderRadius || '0.5rem'
    };

    return (
        <>
            <div className={`skeleton ${className}`} style={style}></div>
            <style>{`
                .skeleton {
                    background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                }
                @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
            `}</style>
        </>
    );
};

export const SkeletonPostCard = () => {
    return (
        <div className="glass" style={{ borderRadius: '1.5rem', overflow: 'hidden', pointerEvents: 'none' }}>
            <Skeleton height="200px" borderRadius="0" />
            <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <Skeleton width="100px" height="14px" />
                    <Skeleton width="60px" height="14px" />
                </div>
                <Skeleton height="28px" width="90%" className="mb-2" />
                <Skeleton height="28px" width="70%" className="mb-4" />
                <Skeleton height="16px" className="mb-2" />
                <Skeleton height="16px" className="mb-2" />
                <Skeleton height="16px" width="80%" />

                <div style={{ paddingTop: '16px', marginTop: '32px', display: 'flex', gap: '16px' }}>
                    <Skeleton width="40px" height="16px" />
                    <Skeleton width="40px" height="16px" />
                </div>
            </div>
            
            <style>{`
                .mb-2 { margin-bottom: 0.5rem; }
                .mb-4 { margin-bottom: 1rem; }
            `}</style>
        </div>
    );
};
