import React, { forwardRef, useId } from 'react';
import './ui.css'; // Shared UI CSS

const FormInput = forwardRef(({
    label,
    error,
    id,
    helperText,
    type = 'text',
    className = '',
    ...props
}, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const isTextarea = type === 'textarea';

    return (
        <div className={`form-group ${className}`}>
            {label && (
                <label htmlFor={inputId} className="input-label">
                    {label}
                </label>
            )}

            <div className="input-wrapper" style={{ position: 'relative' }}>
                {isTextarea ? (
                    <textarea
                        id={inputId}
                        ref={ref}
                        className={`input-field ${error ? 'input-error' : ''}`}
                        style={{ minHeight: '120px', resize: 'vertical' }}
                        {...props}
                    />
                ) : (
                    <input
                        id={inputId}
                        type={type}
                        ref={ref}
                        className={`input-field ${error ? 'input-error' : ''}`}
                        {...props}
                    />
                )}
            </div>

            {(error || helperText) && (
                <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: error ? 'var(--color-error)' : 'var(--color-text-muted)' }}>
                    {error || helperText}
                </div>
            )}
        </div>
    );
});

FormInput.displayName = 'FormInput';

export default FormInput;
