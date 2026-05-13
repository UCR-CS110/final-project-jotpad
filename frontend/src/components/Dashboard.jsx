import React from 'react';

function Dashboard() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>My Dashboard</h2>
      <h3 style={{ color: 'green' }}>My Credits: 5 🪙</h3>
      
      <h3>Recommended Stories for Review</h3>
      <ul>
        <li>
          <strong>The Martian City</strong> (Sci-Fi) 
          <button style={{ marginLeft: '10px' }}>Review to earn 1 Credit</button>
        </li>
        <li style={{ marginTop: '10px' }}>
          <strong>Whispers in the Dark</strong> (Mystery)
          <button style={{ marginLeft: '10px' }}>Review to earn 1 Credit</button>
        </li>
      </ul>
    </div>
  );
}

export default Dashboard;