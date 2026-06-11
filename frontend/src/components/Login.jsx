import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoginView, setIsLoginView] = useState(true);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Login view
    if (isLoginView) {
      try {
        const response = await fetch('/api/login/login', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const text = await response.text();
        if (!response.ok) {
          console.error("Login failed response:", text);
          const data = text && text.startsWith("{") ? JSON.parse(text) : null;
          alert(`Login failed: ${data?.message || response.statusText}`);
          return;
        }

        const data = JSON.parse(text);
        localStorage.setItem('token', data.token);
        navigate('/dashboard');

        if (response.ok) {
          localStorage.setItem('token', data.token);
          alert('Login successful!');
          navigate('/dashboard');
        } else {
          alert(`Login failed: ${data.message}`);
        }
      } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred during login. Please try again later.');
      }
    } else {
      // Sign Up view
      try {
        const response = await fetch('http://localhost:5000/api/login/register', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          alert('Registration successful! Please log in.');
          setIsLoginView(true);
          setEmail('');
          setUsername('');
          setPassword('');
        } else {
          alert(`Registration failed: ${data.message}`);
        }
      } catch (error) {
        console.error('Error during registration:', error);
        alert('An error occurred during registration. Please try again later.');
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Welcome to Jotpad</h1>

        <p className="login-subtitle">
          {isLoginView ? 'Log in to review stories and earn credits.' : 'Create an account to join the community and share your stories.'}
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            required
          />
          {!isLoginView && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
              required
            />
          )}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />
          <button type="submit" className="login-btn">
            {isLoginView ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p style={{ marginTop: '30px', fontSize: '16px', color: '#555' }}>
          {isLoginView ? "Don't have an account? " : "Already have an account? "}
          <button type="button" onClick={() => setIsLoginView(!isLoginView)} className="toggle-btn">
            {isLoginView ? 'Sign up here' : 'Log in here'}
          </button>
        </p>

        <div className="divider">
          <div className="divider-line"></div>
          <span className="divider-text">OR</span>
          <div className="divider-line"></div>
        </div>

        <button type="button" onClick={() => alert("Google sign-in coming soon!")} className="google-btn">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google logo" style={{ width: '18px', height: '18px' }} />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default Login;