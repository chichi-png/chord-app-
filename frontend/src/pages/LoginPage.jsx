import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, user, isPending } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && !isPending()) {
      navigate('/');
    }
  }, [user, navigate, isPending]);

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');

    try {
      const userData = await login(credentialResponse.credential, 'google');

      if (userData.role === 'pending') {
        setLoading(false);
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Google login failed. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.');
  };

  const handleFacebookResponse = async (response) => {
    if (response.accessToken) {
      setLoading(true);
      setError('');

      try {
        const userData = await login(response.accessToken, 'facebook');

        if (userData.role === 'pending') {
          setLoading(false);
        } else {
          navigate('/');
        }
      } catch (err) {
        setError('Facebook login failed. Please try again.');
        setLoading(false);
      }
    } else {
      setError('Facebook login cancelled.');
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const userData = await login('demo', 'demo');
      navigate('/');
    } catch (err) {
      setError('Demo login failed. Please try again.');
      setLoading(false);
    }
  };

  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const facebookAppId = process.env.REACT_APP_FACEBOOK_APP_ID;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>✝ Chord Manager</h1>
        <p style={styles.subtitle}>Worship song chord sheets with transposition</p>

        {isPending() ? (
          <div style={styles.pendingContainer}>
            <div style={styles.pendingIcon}>⏳</div>
            <h2 style={styles.pendingTitle}>Account Pending Approval</h2>
            <p style={styles.pendingText}>
              Your account is awaiting approval by an administrator.
              You'll be able to access the library once approved.
            </p>
            <button onClick={() => window.location.reload()} style={styles.refreshButton}>
              Check Again
            </button>
          </div>
        ) : (
          <>
            <div style={styles.loginButtons}>
              {googleClientId && (
                <GoogleOAuthProvider clientId={googleClientId}>
                  <div style={styles.googleButton}>
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      text="signin_with"
                      shape="rectangular"
                      theme="filled_black"
                      size="large"
                      width="300"
                    />
                  </div>
                </GoogleOAuthProvider>
              )}

              {facebookAppId && (
                <FacebookLogin
                  appId={facebookAppId}
                  callback={handleFacebookResponse}
                  fields="name,email,picture"
                  render={(renderProps) => (
                    <button
                      onClick={renderProps.onClick}
                      disabled={loading}
                      style={styles.facebookButton}
                    >
                      <span style={styles.facebookIcon}>f</span>
                      Sign in with Facebook
                    </button>
                  )}
                />
              )}

              {/* Demo Mode Button */}
              <div style={styles.divider}>
                <span style={styles.dividerText}>OR</span>
              </div>

              <button
                onClick={handleDemoLogin}
                disabled={loading}
                style={styles.demoButton}
              >
                🎭 Demo Login (Testing Only)
              </button>

              <p style={styles.demoNote}>
                ⚠️ Demo mode - Full admin access without OAuth setup
              </p>
            </div>

            {error && <div style={styles.error}>{error}</div>}
            {loading && <div style={styles.loading}>Signing in...</div>}
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    padding: '20px',
  },
  card: {
    backgroundColor: '#0a0a0a',
    padding: '40px',
    borderRadius: '8px',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
    border: '1px solid #222',
  },
  title: {
    fontSize: '32px',
    marginBottom: '10px',
    color: '#ffffff',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontWeight: '300',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '15px',
    color: '#888',
    marginBottom: '40px',
    fontWeight: '300',
  },
  loginButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    alignItems: 'center',
  },
  googleButton: {
    display: 'flex',
    justifyContent: 'center',
  },
  facebookButton: {
    width: '300px',
    padding: '12px 24px',
    backgroundColor: '#1877f2',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  facebookIcon: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  error: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#1a0000',
    color: '#ff4444',
    borderRadius: '6px',
    fontSize: '14px',
    border: '1px solid #ff0000',
  },
  loading: {
    marginTop: '20px',
    color: '#ffffff',
    fontSize: '14px',
  },
  pendingContainer: {
    padding: '20px',
  },
  pendingIcon: {
    fontSize: '48px',
    marginBottom: '20px',
  },
  pendingTitle: {
    fontSize: '24px',
    color: '#ffffff',
    marginBottom: '15px',
  },
  pendingText: {
    fontSize: '16px',
    color: '#888',
    lineHeight: '1.5',
    marginBottom: '25px',
  },
  refreshButton: {
    padding: '12px 24px',
    backgroundColor: '#ffffff',
    color: '#000000',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    margin: '20px 0 10px 0',
  },
  dividerText: {
    padding: '0 10px',
    color: '#666',
    fontSize: '12px',
    fontWeight: '600',
  },
  demoButton: {
    width: '300px',
    padding: '14px 24px',
    backgroundColor: '#ffffff',
    color: '#000000',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  demoNote: {
    fontSize: '12px',
    color: '#888',
    margin: '10px 0 0 0',
    maxWidth: '300px',
    lineHeight: '1.4',
  },
};

export default LoginPage;
