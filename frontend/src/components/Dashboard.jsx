import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Profile from "./Profile.jsx";
import InboxIcon from '../assets/inbox.png'
import pfp from '../assets/pfp.webp';
import './Dashboard.css'

function Dashboard() {
  return (
    <div id="dashboard" style={{ padding: '20px' }}>
      <div className="dashboard-start">
        <div>
          <h1>My Dashboard</h1>
          <h2 style={{ color: 'green' }}>My Credits: 5 🪙</h2>
        </div>
        <div className="dashboard-dropdown">
        <img src={pfp} className="dashboard-pfp dashboard-dropdown-button"></img>
        <div className="dashboard-dropdown-content">
          <p><Link to="/profile">My Profile</Link></p>
          <p><Link to="/inbox">Inbox <img src={InboxIcon} className="inbox-icon"></img></Link></p>
          <p><Link to="/drafts">Drafts</Link></p>
        </div>
      </div>
      </div>
      <hr id="dashboard-hr" />
      <br />
      <div id="dashboard-recommendations">
      <h2>Recommended For You</h2>
      <ul className="dashboard-recommendation-stories">
        <div className="dashboard-recommendation-story">
          <strong>The Martian City</strong> (Sci-Fi) 
          <button className="recommendation-story-button" style={{ marginLeft: '10px' }}>Review to earn 1 Credit</button>
        </div>
        <li className="dashboard-recommendation-story" style={{ marginTop: '10px' }}>
          <strong>Whispers in the Dark</strong> (Mystery)
          <button className="recommendation-story-button" style={{ marginLeft: '10px' }}>Review to earn 1 Credit</button>
        </li>
      </ul>
      </div>
      
    </div>
  );
}

export default Dashboard;