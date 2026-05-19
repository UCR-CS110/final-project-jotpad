import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import StoryReader from './components/StoryReader';
import Profile from './components/Profile';
import RequestListing from './components/RequestListing';
import Inbox from './components/Inbox';
import RequestDetails from './components/RequestDetails';

function App() {
  return (
    <Router>
      <nav style={{ background: '#333', padding: '15px' }}>
        <Link to="/" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>Login</Link>
        <Link to="/dashboard" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>Dashboard</Link>
        <Link to="/betarequests" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>Find Beta Requests</Link>
        <Link to="/story" style={{ color: 'white', textDecoration: 'none' }}>Read Story</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/story" element={<StoryReader />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/betarequests/*" element={<RequestListing />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/requests/:id" element={<RequestDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
