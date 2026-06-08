import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Logout from './components/Logout';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import StoryReader from './components/StoryReader';
import Profile from './components/Profile';
import RequestListing from './components/RequestListing';
import Inbox from './components/Inbox';
import RequestDetails from './components/RequestDetails';
import StoryEditor from './components/StoryEditor';
import Drafts from './components/Drafts';
import "./App.css"
import StoryView from './components/StoryView';
import './App.css';

function App() {
  const API_URL = "http://localhost:5000/api/books";

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/storyeditor" element={<StoryEditor />} />
          <Route path="/story" element={<StoryReader />} />
          <Route path="/story/:id" element={<StoryView />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/betarequests/*" element={<RequestListing />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/requests/:id" element={<RequestDetails />} />
          <Route path="/drafts" element={<Drafts />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
