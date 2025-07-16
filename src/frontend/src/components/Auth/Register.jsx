import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail, validateUserName } from '../../utils/helpers';

const Register = () => {
    const navigate = useNavigate();
    const { generateOTP } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        name: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Inline styles
    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
    };

    const cardStyle = {
        background: 'white',
        borderRadius: '12px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        animation: 'fadeIn 0.3s ease-in-out'
    };

    const titleStyle = {
        textAlign: 'center',
        marginBottom: '30px',
        color: '#333',
        fontSize: '28px',
        fontWeight: '600'
    };

    const inputStyle = {
        width: '100%',
        padding: '15px',
        border: '2px solid #e1e5e9',
        borderRadius: '8px',
        fontSize: '16px',
        marginBottom: '20px',
        boxSizing: 'border-box',
        transition: 'border-color 0.3s ease'
    };

    const buttonStyle = {
        width: '100%',
        padding: '15px',
        background: isLoading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        marginBottom: '20px',
        opacity: isLoading ? 0.7 : 1
    };

    const errorStyle = {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '12px',
        borderRadius: '6px',
        marginBottom: '20px',
        border: '1px solid #f5c6cb',
        fontSize: '14px'
    };

    const linksStyle = {
        textAlign: 'center',
        marginBottom: '20px'
    };

    const linkTextStyle = {
        color: '#666',
        fontSize: '14px',
        marginBottom: '10px'
    };

    const linkButtonStyle = {
        background: 'none',
        border: 'none',
        color: '#667eea',
        cursor: 'pointer',
        fontSize: '14px',
        textDecoration: 'underline',
        marginLeft: '5px'
    };

    const helpStyle = {
        textAlign: 'center',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        marginTop: '20px'
    };

    const helpTextStyle = {
        color: '#6c757d',
        fontSize: '12px',
        lineHeight: '1.4'
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setIsLoading(true);
            setError('');

            if (!validateEmail(formData.email)) {
                setError('Please enter a valid email address');
                return;
            }

            if (!validateUserName(formData.name)) {
                setError('Please enter a valid name (1-100 characters)');
                return;
            }

            const result = await generateOTP(formData.email);
            
            if (result.success) {
                alert(`OTP Generated!\n\nEmail: ${formData.email}\nOTP: ${result.otp}\n\nCheck browser console for details.`);
                
                navigate('/verify-otp', {
                    state: {
                        email: formData.email,
                        name: formData.name,
                        isRegister: true
                    }
                });
            } else {
                setError(result.error);
            }
        } catch (error) {
            console.error('❌ Registration error:', error);
            setError('Failed to generate OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={titleStyle}>Create Account</h2>
                
                {error && <div style={errorStyle}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleInputChange}
                        style={inputStyle}
                        required
                    />

                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        style={inputStyle}
                        required
                    />

                    <button 
                        type="submit" 
                        style={buttonStyle}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Generating OTP...' : 'Continue'}
                    </button>
                </form>

                <div style={linksStyle}>
                    <p style={linkTextStyle}>
                        Already have an account? 
                        <button 
                            type="button" 
                            style={linkButtonStyle}
                            onClick={() => navigate('/login')}
                        >
                            Sign In
                        </button>
                    </p>
                </div>

                <div style={helpStyle}>
                    <small style={helpTextStyle}>
                        <strong>Development Mode:</strong> OTP will be displayed in browser console and alert popup.
                    </small>
                </div>
            </div>
        </div>
    );
};

export default Register;