import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  // Store the user input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  // true = Login view, false = Sign Up view
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
    <div style={{ padding: '20px' }}>
      <h1>Welcome to Jotpad</h1>

      {/* Text based on the current view */}
      <p>{isLoginView ? 'Log in to review stories and earn credits.' : 'Create an account to join the community and share your stories.'}</p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: 'block', margin: '10px 0', padding: '5px' }}
          required
        />
        {isLoginView ? <></> :
          <input
            type="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ display: 'block', margin: '10px 0', padding: '5px' }}
            required
          />
        }
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: 'block', margin: '10px 0', padding: '5px' }}
          required
        />
        <button type="submit" style={{ padding: '5px 15px', cursor: 'pointer' }}>
          {isLoginView ? 'Login' : 'Sign Up'}
        </button>
      </form>

      <p style={{ marginTop: '15px' }}>
        {isLoginView ? "Don't have an account? " : "Already have an account? "}
        <button
          type="button"
          onClick={() => setIsLoginView(!isLoginView)}
          style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {isLoginView ? 'Sign up here' : 'Log in here'}
        </button>
      </p>

      <hr style={{ margin: '20px 0' }} />
      <button type="button" onClick={() => alert("Google sign-in coming soon!")}>
        Sign in with Google
      </button>
    </div>
  );
}

export default Login;