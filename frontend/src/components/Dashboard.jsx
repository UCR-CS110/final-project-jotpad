import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Profile from "./Profile.jsx";
import InboxIcon from '../assets/inbox.png'
import pfp from '../assets/pfp.webp';
import './Dashboard.css'

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
            credentials: 'include',
        });
  
        if (!res.ok) {
          throw new Error("Failed to fetch profile information");
        }
  
        const data = await res.json();
          
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
      
    fetchProfile();
  }, []);

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading dashboard...</div>;
  }

  if (error) {
    return <div style={{ padding: "20px", color: "red" }}>{error}</div>;
  }

  return (
    <div id="dashboard" style={{ padding: '20px' }}>
      <div className="dashboard-start">
        <div>
          <h1>My Dashboard</h1>
          <div style={{ display: 'flex' }}>
          <h2>Welcome, {profile.username}!</h2>
          <h2 style={{ color: 'green' }}>My Credits: {profile.credits} 🪙</h2>
          </div>
        </div>
        <div className="dashboard-dropdown">
        <img src={pfp} className="dashboard-pfp dashboard-dropdown-button"></img>
        <div className="dashboard-dropdown-content">
          <p><Link to={"/profile/"+profile.username}>My Profile</Link></p>
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