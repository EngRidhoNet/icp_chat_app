import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { validateOTP } from '../../utils/helpers';

const OTPVerification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { register, generateOTP } = useAuth();
    const { email, name, isRegister } = location.state || {};
    
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

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

    const descriptionStyle = {
        textAlign: 'center',
        marginBottom: '20px',
        color: '#666',
        fontSize: '14px',
        lineHeight: '1.5'
    };

    const otpInputStyle = {
        width: '100%',
        padding: '15px',
        border: '2px solid #e1e5e9',
        borderRadius: '8px',
        fontSize: '24px',
        marginBottom: '5px',
        boxSizing: 'border-box',
        textAlign: 'center',
        fontWeight: '600',
        letterSpacing: '8px',
        fontFamily: 'monospace'
    };

    const helpTextStyle = {
        display: 'block',
        marginTop: '5px',
        marginBottom: '20px',
        color: '#6c757d',
        fontSize: '12px',
        lineHeight: '1.4'
    };

    const buttonStyle = {
        width: '100%',
        padding: '15px',
        background: (isLoading || otp.length !== 6) ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: (isLoading || otp.length !== 6) ? 'not-allowed' : 'pointer',
        marginBottom: '20px',
        opacity: (isLoading || otp.length !== 6) ? 0.7 : 1
    };

    const linkButtonStyle = {
        background: 'none',
        border: 'none',
        color: '#667eea',
        cursor: 'pointer',
        fontSize: '14px',
        textDecoration: 'underline',
        margin: '0 10px',
        disabled: isLoading
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

    const successStyle = {
        backgroundColor: '#d4edda',
        color: '#155724',
        padding: '12px',
        borderRadius: '6px',
        marginBottom: '20px',
        border: '1px solid #c3e6cb',
        fontSize: '14px'
    };

    const linksStyle = {
        textAlign: 'center',
        marginBottom: '20px'
    };

    const helpStyle = {
        textAlign: 'center',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        marginTop: '20px'
    };

    const helpStyleText = {
        color: '#6c757d',
        fontSize: '12px',
        lineHeight: '1.4'
    };

    const handleOtpChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        setOtp(value);
        setError('');
    };

    const verifyOTP = async () => {
        try {
            setIsLoading(true);
            setError('');

            if (!validateOTP(otp)) {
                setError('Please enter a valid 6-digit OTP');
                return;
            }

            if (isRegister) {
                const result = await register(email, name, otp);
                
                if (result.success) {
                    setMessage('Registration successful! Redirecting to chat...');
                    setTimeout(() => {
                        navigate('/chat');
                    }, 1500);
                } else {
                    setError(result.error);
                }
            }
        } catch (error) {
            console.error('❌ Verify OTP error:', error);
            setError('Failed to verify OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await verifyOTP();
    };

    const resendOTP = async () => {
        try {
            setIsLoading(true);
            setError('');
            setMessage('');

            const result = await generateOTP(email);
            
            if (result.success) {
                alert(`New OTP Generated!\n\nEmail: ${email}\nOTP: ${result.otp}\n\nCheck browser console for details.`);
                setMessage('New OTP generated! Check browser console and the alert above.');
                setOtp('');
            } else {
                setError(result.error);
            }
        } catch (error) {
            console.error('❌ Resend OTP error:', error);
            setError('Failed to resend OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const goBack = () => {
        navigate(-1);
    };

    if (!email) {
        return (
            <div style={containerStyle}>
                <div style={cardStyle}>
                    <h2 style={titleStyle}>Error</h2>
                    <p>No email provided. Please go back and try again.</p>
                    <button 
                        type="button" 
                        style={buttonStyle}
                        onClick={() => navigate('/register')}
                    >
                        Back to Register
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={titleStyle}>Verify OTP</h2>
                <p style={descriptionStyle}>
                    Enter the 6-digit code sent to:<br />
                    <strong>{email}</strong>
                </p>
                
                {error && <div style={errorStyle}>{error}</div>}
                {message && <div style={successStyle}>{message}</div>}

                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="text"
                            value={otp}
                            onChange={handleOtpChange}
                            placeholder="Enter 6-digit OTP"
                            maxLength="6"
                            style={otpInputStyle}
                            required
                            autoFocus
                        />
                        <small style={helpTextStyle}>
                            OTP is shown in browser console and alert popup
                        </small>
                    </div>

                    <button 
                        type="submit" 
                        style={buttonStyle}
                        disabled={isLoading || otp.length !== 6}
                    >
                        {isLoading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                </form>

                <div style={linksStyle}>
                    <button 
                        type="button" 
                        style={linkButtonStyle}
                        onClick={resendOTP}
                        disabled={isLoading}
                    >
                        Resend OTP
                    </button>
                    
                    <button 
                        type="button" 
                        style={linkButtonStyle}
                        onClick={goBack}
                    >
                        Back
                    </button>
                </div>

                <div style={helpStyle}>
                    <small style={helpStyleText}>
                        <strong>Development Mode:</strong> OTP is displayed in browser console and alert popup.
                    </small>
                </div>
            </div>
        </div>
    );
};

export default OTPVerification;