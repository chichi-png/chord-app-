import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { useAuth } from '../contexts/AuthContext';
import { colors, typography, spacing, borderRadius, shadows, components } from '../styles/designSystem';

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
    backgroundColor: colors.background,
    padding: '20px',
    fontFamily: typography.fontFamily,
  },
  card: {
    backgroundColor: colors.cardBg,
    padding: '40px',
    borderRadius: '16px',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
    border: `1px solid ${colors.border}`,
    boxShadow: '0 4px 16px rgba(44,24,16,0.08)',
  },
  title: {
    fontSize: '32px',
    marginBottom: '10px',
    color: colors.darkText,
    fontFamily: typography.fontFamily,
    fontWeight: typography.medium,
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.secondaryText,
    marginBottom: '40px',
    fontWeight: typography.normal,
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
    borderRadius: borderRadius.button,
    fontSize: typography.body,
    fontWeight: typography.semibold,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    boxShadow: shadows.button,
    transition: 'all 0.2s ease',
  },
  facebookIcon: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  error: {
    marginTop: '20px',
    padding: spacing.cardPadding,
    backgroundColor: colors.errorBg,
    color: colors.error,
    borderRadius: borderRadius.card,
    fontSize: typography.metadata,
    border: `1px solid ${colors.errorBorder}`,
  },
  loading: {
    marginTop: '20px',
    color: colors.primaryAccent,
    fontSize: typography.metadata,
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
    color: colors.darkText,
    marginBottom: '15px',
    fontWeight: typography.medium,
  },
  pendingText: {
    fontSize: typography.body,
    color: colors.secondaryText,
    lineHeight: '1.5',
    marginBottom: '25px',
  },
  refreshButton: {
    ...components.buttonPrimary,
    width: 'auto',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    margin: '20px 0 10px 0',
  },
  dividerText: {
    padding: '0 10px',
    color: colors.secondaryText,
    fontSize: typography.small,
    fontWeight: typography.semibold,
  },
  demoButton: {
    width: '300px',
    ...components.buttonPrimary,
    fontSize: typography.body,
  },
  demoNote: {
    fontSize: typography.small,
    color: colors.secondaryText,
    margin: '10px 0 0 0',
    maxWidth: '300px',
    lineHeight: '1.4',
  },
};

export default LoginPage;
