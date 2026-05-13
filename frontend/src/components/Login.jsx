import React from 'react';

function Login() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to Jotpad</h1>
      <p>Log in to review stories and earn credits.</p>
      <form>
        <input type="email" placeholder="Email" style={{ display: 'block', margin: '10px 0' }} />
        <input type="password" placeholder="Password" style={{ display: 'block', margin: '10px 0' }} />
        <button type="button">Login</button>
      </form>
      <hr />
      <button type="button">Sign in with Google</button>
    </div>
  );
}

export default Login;