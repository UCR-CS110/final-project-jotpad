import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('metrics');
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchUsers() {
            if (activeTab !== 'users') return;
            
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:5000/api/users", {
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

    async function handleBanUser(userId, username) {
        if (!window.confirm(`Are you sure you want to ban ${username}? This is irreversible.`)) {
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!res.ok) throw new Error("Error banning user. You might not have permission to perform this action.");

            setUsers(users.filter(u => u._id !== userId));
            alert(`${username} has been banned.`);
        } catch (err) {
            alert(err.message);
        }
    }

    const dashboardStyle = { display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' };
    const sidebarStyle = { width: '250px', backgroundColor: '#2c3e50', color: 'white', padding: '20px' };
    const contentStyle = { flex: 1, padding: '40px', backgroundColor: '#f4f6f8' };
    
    const menuBtnStyle = { 
        display: 'block', width: '100%', padding: '12px', marginBottom: '10px', 
        cursor: 'pointer', backgroundColor: 'transparent', color: 'white', 
        border: '1px solid #34495e', textAlign: 'left', borderRadius: '5px', fontSize: '16px'
    };
    const activeBtnStyle = { ...menuBtnStyle, backgroundColor: '#3498db', border: 'none', fontWeight: 'bold' };

    return (
        <div style={dashboardStyle}>
            <div style={sidebarStyle}>
                <h2 style={{ marginTop: 0 }}>Admin Panel</h2>
                <hr style={{ borderColor: '#34495e', marginBottom: '30px' }} />
                
                <button 
                    style={activeTab === 'metrics' ? activeBtnStyle : menuBtnStyle} 
                    onClick={() => setActiveTab('metrics')}
                >
                    📊 Metrics & Stats
                </button>
                <button 
                    style={activeTab === 'users' ? activeBtnStyle : menuBtnStyle} 
                    onClick={() => setActiveTab('users')}
                >
                    👥 Manage Users
                </button>
                <button 
                    style={activeTab === 'content' ? activeBtnStyle : menuBtnStyle} 
                    onClick={() => setActiveTab('content')}
                >
                    📝 Manage Content
                </button>
                
                <button 
                    style={{ ...menuBtnStyle, marginTop: '50px', backgroundColor: '#e74c3c', borderColor: '#c0392b' }} 
                    onClick={() => navigate('/dashboard')}
                >
                    ⬅ Back to App
                </button>
            </div>

            <div style={contentStyle}>
                
                {activeTab === 'metrics' && (
                    <div>
                        <h1 style={{ marginTop: 0 }}>Site Metrics</h1>
                        <p>Dashboard for total users, published stories, and site activity will go here.</p>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div>
                        <h1 style={{ marginTop: 0 }}>User Management</h1>
                        <p style={{ marginBottom: '20px', color: '#666' }}>List of registered users. Admins can revoke access here.</p>
                        
                        {error && <div style={{ color: 'red', padding: '10px', backgroundColor: '#ffdcd8', marginBottom: '15px' }}>{error}</div>}
                        {loading && <p>Loading users from database...</p>}
                        
                        {!loading && !error && (
                            <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                {users.map(user => (
                                    <div key={user._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #eee' }}>
                                        <div>
                                            <strong style={{ fontSize: '1.1rem' }}>{user.username}</strong>
                                            <span style={{ marginLeft: '10px', fontSize: '0.9rem', color: '#888' }}>{user.email}</span>
                                            <span style={{ 
                                                marginLeft: '10px', fontSize: '0.8rem', padding: '3px 8px', borderRadius: '12px',
                                                backgroundColor: user.role === 'admin' ? '#ffeaa7' : '#e0e0e0',
                                                color: user.role === 'admin' ? '#d35400' : '#555'
                                            }}>
                                                {user.role}
                                            </span>
                                        </div>
                                        
                                        {user.role !== 'admin' && (
                                            <button 
                                                onClick={() => handleBanUser(user._id, user.username)}
                                                style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}
                                            >
                                                Ban User
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'content' && (
                    <div>
                        <h1 style={{ marginTop: 0 }}>Content Moderation</h1>
                        <p>List of stories and feedback. Here you can delete inappropriate content.</p>
                    </div>
                )}

            </div>
        </div>
    );
}