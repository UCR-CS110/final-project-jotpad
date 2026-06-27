import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('metrics');
    const navigate = useNavigate();


    const [users, setUsers] = useState([]);
    const [stories, setStories] = useState([]);
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {

        async function fetchUser() {
            try {

                const res = await fetch(
                    "http://localhost:5000/api/users/me",
                    {
                        credentials: 'include'
                    }
                );

                if (!res.ok) {
                    throw new Error("Failed to fetch user");
                }

                const data = await res.json();
                setHasPermission(data.role == "admin");
            } catch (err) {
                console.log(err);
            }
        }
        fetchUser();
    }, []);

    useEffect(() => {
        async function fetchMetrics() {
            if (activeTab !== 'metrics') return;
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:5000/api/stories/metrics", {
                    credentials: 'include',
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (!res.ok) throw new Error("Could not load real metrics.");
                const data = await res.json();
                setMetrics(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchMetrics();
    }, [activeTab]);

    useEffect(() => {
        async function fetchUsers() {
            if (activeTab !== 'users') return;
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:5000/api/users", {
                    credentials: 'include',
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (!res.ok) throw new Error("You don't have permission to view this page.");
                const data = await res.json();
                setUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, [activeTab]);

    useEffect(() => {
        async function fetchStories() {
            if (activeTab !== 'content') return;
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:5000/api/stories/in_review", {
                    credentials: 'include',
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (!res.ok) throw new Error("Could not load stories for moderation.");
                const data = await res.json();
                setStories(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchStories();
    }, [activeTab]);

    if (!hasPermission) {
        return (<div style={{ fontSize: '20px', marginTop: '50px', justifySelf: 'center' }}>You do not have permission to view this page.</div>);
    }

    async function handleBanUser(userId, username) {
        if (!window.confirm(`Are you sure you want to ban ${username}? This is irreversible.`)) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Error banning user.");
            setUsers(users.filter(u => u._id !== userId));
            alert(`${username} has been banned.`);
        } catch (err) { alert(err.message); }
    }

    async function handleApproveStory(storyId, title) {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5000/api/stories/${storyId}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({ status: "public" })
            });
            if (!res.ok) throw new Error("Error approving story.");
            setStories(stories.filter(s => s._id !== storyId));
            alert(`The story "${title}" is now public.`);
        } catch (err) { alert(err.message); }
    }

    async function handleDeleteStory(storyId, title) {
        if (!window.confirm(`Are you sure you want to delete the story "${title}"?`)) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5000/api/stories/${storyId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Error deleting story.");
            setStories(stories.filter(s => s._id !== storyId));
            alert(`"${title}" has been deleted.`);
        } catch (err) { alert(err.message); }
    }

    const dashboardStyle = { display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f4f6f8' };
    const sidebarStyle = { width: '250px', backgroundColor: '#2c3e50', color: 'white', padding: '20px', position: 'fixed', height: '100vh', boxSizing: 'border-box' };
    const contentStyle = { flex: 1, padding: '40px', marginLeft: '250px', boxSizing: 'border-box' };
    const menuBtnStyle = { display: 'block', width: '100%', padding: '12px', marginBottom: '10px', cursor: 'pointer', backgroundColor: 'transparent', color: 'white', border: '1px solid #34495e', textAlign: 'left', borderRadius: '5px', fontSize: '16px', transition: '0.2s' };
    const activeBtnStyle = { ...menuBtnStyle, backgroundColor: '#3498db', border: 'none', fontWeight: 'bold' };
    const cardGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' };
    const cardStyle = { backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', textAlign: 'center' };

    return (
        <div style={dashboardStyle}>
            <div style={sidebarStyle}>
                <h2 style={{ marginTop: 0, fontSize: '22px' }}>Jotpad Admin</h2>
                <p style={{ fontSize: '12px', color: '#bdc3c7', marginTop: '-10px' }}>Control Panel</p>
                <hr style={{ borderColor: '#34495e', marginBottom: '30px' }} />
                
                <button style={activeTab === 'metrics' ? activeBtnStyle : menuBtnStyle} onClick={() => setActiveTab('metrics')}>📊 Metrics & Stats</button>
                <button style={activeTab === 'users' ? activeBtnStyle : menuBtnStyle} onClick={() => setActiveTab('users')}>👥 Manage Users</button>
                <button style={activeTab === 'content' ? activeBtnStyle : menuBtnStyle} onClick={() => setActiveTab('content')}>📝 Manage Content</button>
                
                <button style={{ ...menuBtnStyle, marginTop: '80px', backgroundColor: '#e74c3c', borderColor: '#c0392b' }} onClick={() => navigate('/dashboard')}>⬅ Back to App</button>
            </div>

            <div style={contentStyle}>
                {error && <div style={{ color: 'red', padding: '10px', backgroundColor: '#ffdcd8', marginBottom: '15px', borderRadius: '5px' }}>{error}</div>}
                {loading && <p>Loading data from database...</p>}
                
                {activeTab === 'metrics' && !loading && metrics && (
                    <div>
                        <h1 style={{ marginTop: 0, color: '#2c3e50' }}>Site Metrics</h1>
                        <p style={{ color: '#7f8c8d' }}>Real-time overview of Jotpad activity.</p>
                        
                        <div style={cardGridStyle}>
                            <div style={cardStyle}>
                                <h3 style={{ margin: 0, color: '#7f8c8d', fontSize: '14px' }}>Total Users</h3>
                                <h2 style={{ margin: '10px 0 0 0', fontSize: '32px', color: '#2c3e50' }}>{metrics.totalUsers}</h2>
                            </div>
                            <div style={cardStyle}>
                                <h3 style={{ margin: 0, color: '#7f8c8d', fontSize: '14px' }}>Active Beta Readers</h3>
                                <h2 style={{ margin: '10px 0 0 0', fontSize: '32px', color: '#3498db' }}>{metrics.activeBetaReaders}</h2>
                            </div>
                            <div style={cardStyle}>
                                <h3 style={{ margin: 0, color: '#7f8c8d', fontSize: '14px' }}>Published Stories</h3>
                                <h2 style={{ margin: '10px 0 0 0', fontSize: '32px', color: '#2ecc71' }}>{metrics.publishedStories}</h2>
                            </div>
                            <div style={cardStyle}>
                                <h3 style={{ margin: 0, color: '#7f8c8d', fontSize: '14px' }}>Stories In Review</h3>
                                <h2 style={{ margin: '10px 0 0 0', fontSize: '32px', color: '#e67e22' }}>{metrics.storiesInReview}</h2>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && !loading && (
                    <div>
                        <h1 style={{ marginTop: 0, color: '#2c3e50' }}>User Management</h1>
                        <p style={{ color: '#7f8c8d' }}>List of registered accounts in the system.</p>
                        
                        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                            {users.map(user => (
                                <div key={user._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #eee' }}>
                                    <div>
                                        <strong style={{ fontSize: '1.1rem', color: '#2c3e50' }}>{user.username}</strong>
                                        <span style={{ marginLeft: '10px', fontSize: '0.9rem', color: '#888' }}>{user.email}</span>
                                        <span style={{ 
                                            marginLeft: '10px', fontSize: '0.8rem', padding: '3px 8px', borderRadius: '12px',
                                            backgroundColor: user.role === 'admin' ? '#ffeaa7' : '#e0e0e0',
                                            color: user.role === 'admin' ? '#d35400' : '#555', fontWeight: 'bold'
                                        }}>
                                            {user.role}
                                        </span>
                                    </div>
                                    
                                    {user.role !== 'admin' && (
                                        <button 
                                            onClick={() => handleBanUser(user._id, user.username)}
                                            style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                                        >
                                            Ban User
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'content' && !loading && (
                    <div>
                        <h1 style={{ marginTop: 0, color: '#2c3e50' }}>Content Moderation</h1>
                        <p style={{ color: '#7f8c8d' }}>Review and approve in-review stories, or delete reported content.</p>
                        
                        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                            {stories.length === 0 ? (
                                <p style={{ color: '#7f8c8d', margin: 0 }}>No stories waiting for review. Good job!</p>
                            ) : (
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid #eee', color: '#7f8c8d' }}>
                                            <th style={{ padding: '12px' }}>Story Title</th>
                                            <th style={{ padding: '12px' }}>Author</th>
                                            <th style={{ padding: '12px' }}>Status</th>
                                            <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stories.map(story => (
                                            <tr key={story._id} style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '15px', fontWeight: 'bold', color: '#2c3e50' }}>{story.title}</td>
                                                <td style={{ padding: '15px', color: '#555' }}>{story.author?.username || 'Unknown'}</td>
                                                <td style={{ padding: '15px' }}>
                                                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', backgroundColor: '#fff3cd', color: '#856404' }}>
                                                        {story.status}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '15px', textAlign: 'right' }}>
                                                    <button 
                                                        onClick={() => handleApproveStory(story._id, story.title)}
                                                        style={{ backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '10px', fontWeight: 'bold' }}
                                                    >
                                                        Approve
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteStory(story._id, story.title)}
                                                        style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}