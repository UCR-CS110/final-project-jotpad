import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Profile from "./Profile.jsx";
import InboxIcon from '../assets/inbox.png'
import './Dashboard.css'

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [recommendationsError, setRecommendationsError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);
  const [pfpLink, setPfpLink] = useState('https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg');
  const [requests, setRequests] = useState(null);

  const navigate = useNavigate();

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
        if (data.pfpLink) setPfpLink(data.pfpLink);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
      
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/stories/requests');
          if (!response.ok) throw new Error("We couldn't fetch the beta requests.");
                  
          const data = await response.json();
          setRequests(data.slice(1, 3));
        } catch (err) {
          setRecommendationsError(err.message);
        } finally {
          setRecommendationsLoading(false);
        }
    };
  
  fetchRequests();
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
          <div style={{ display: 'flex', gap: '10px' }}>
          <h2>Welcome, {profile.username}!</h2>
          <h2 style={{ color: 'green' }}>My Credits: {profile.credits} 🪙</h2>
          </div>
        </div>
        <div className="dashboard-dropdown">
        <img src={pfpLink} className="dashboard-pfp dashboard-dropdown-button"></img>
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
      {recommendationsLoading ? <div style={{ padding: "20px" }}>Loading dashboard...</div> : <></>}
      {recommendationsError ? <div style={{ padding: "20px", color: "red" }}>{recommendationsError}</div> : <></>}
      <ul className="dashboard-recommendation-stories">
        {requests.length == 0 ? <p>There are no recommendations to display at this time.</p> : <></>}
        {requests.map((request) => (
          <div className="dashboard-recommendation-story">
            <strong>{request.title}</strong> ({request.genre})
            <button className="recommendation-story-button" style={{ marginLeft: '10px' }} onClick={() => {navigate("/requests/"+request._id)}}>Review to earn 1 Credit</button>
          </div>
        ))}
      </ul>
      </div>
      
    </div>
  );
}

export default Dashboard;