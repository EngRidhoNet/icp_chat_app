import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail } from '../../utils/helpers';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
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

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setIsLoading(true);
            setError('');

            if (!validateEmail(email)) {
                setError('Please enter a valid email address');
                return;
            }

            const result = await login(email);
            
            if (result.success) {
                console.log('✅ Login successful, redirecting to chat...');
            } else {
                setError(result.error);
            }
        } catch (error) {
            console.error('❌ Login error:', error);
            setError('Failed to login. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={titleStyle}>Sign In</h2>
                
                {error && <div style={errorStyle}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Email Address"
                        style={inputStyle}
                        required
                    />

                    <button 
                        type="submit" 
                        style={buttonStyle}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div style={linksStyle}>
                    <p style={linkTextStyle}>
                        Don't have an account? 
                        <button 
                            type="button" 
                            style={linkButtonStyle}
                            onClick={() => navigate('/register')}
                        >
                            Sign Up
                        </button>
                    </p>
                </div>

                <div style={helpStyle}>
                    <small style={helpTextStyle}>
                        Enter your email to sign in. New users will be prompted to register.
                    </small>
                </div>
            </div>
        </div>
    );
};

export default Login;