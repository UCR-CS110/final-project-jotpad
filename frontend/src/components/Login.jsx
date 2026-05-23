import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  // Store the user input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // true = Login view, false = Sign Up view
  const [isLoginView, setIsLoginView] = useState(true);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || "Login failed");
      localStorage.setItem("token", body.token);
      nav("/dashboard");
    } catch (err) {
      setError(err.message);
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