import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useNavigate, Link } from 'react-router-dom';
import './Profile.css'

function ProfileStory({ image, title, author, description }) {
    return (
        <div className="profile-story">
            <img src={image} alt="story-cover1" className="profile-story-cover" />
            <div className="profile-story-info">
                <h2 className="profile-story-title">{title}</h2>
                <p className="profile-story-author">By <Link to={"/profile"}>{author}</Link></p>
                <p className="profile-story-description">{description}</p>
            </div>
        </div>
    );
}

export default function Profile() {
    const [isMe, setIsMe] = useState(false);
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [works, setWorks] = useState([]);
    const [bio, setBio] = useState('');
    const [editing, setEditing] = useState(false);
    const [pfpLink, setPfpLink] = useState('https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg');
    const [bannerLink, setBannerLink] = useState('https://www.solidbackgrounds.com/images/950x350/950x350-gray-solid-color-background.jpg');

    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollowLoading, setIsFollowLoading] = useState(false);

    const navigate = useNavigate();
    let params = useParams();

     useEffect(() => {
        async function fetchProfile() {
          try {
            const res = await fetch("http://localhost:5000/api/users/me", {
                credentials: 'include'
            });
    
            if (!res.ok) {
              throw new Error("Failed to fetch profile");
            }
    
            const data = await res.json();
            
            const loadSocialData = (profileData) => {
                setFollowersCount(profileData.followers ? profileData.followers.length : 0);
                setFollowingCount(profileData.following ? profileData.following.length : 0);
                if (profileData.isFollowedByMe) setIsFollowing(true);
            };

            if (data.username == params.username) {
                setProfile(data);
                setBio(data.bio);
                if (data.pfpLink) setPfpLink(data.pfpLink);
                if (data.bannerLink) setBannerLink(data.bannerLink);
                setIsMe(true);
                loadSocialData(data);
            } else {
                const res2 = await fetch("http://localhost:5000/api/users/byUsername/" + params.username, {
                    credentials: 'include'
                }); 
    
                if (!res2.ok) {
                    throw new Error("Failed to fetch profile");
                }
    
                const data2 = await res2.json();
                setProfile(data2);
                setBio(data2.bio);
                if (data2.pfpLink) setPfpLink(data2.pfpLink);
                if (data2.bannerLink) setBannerLink(data2.bannerLink);
                setIsMe(false);
                loadSocialData(data2);
            }

          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        }
    
        fetchProfile();
    }, [params.username]);

    useEffect(() => {
        async function getWorks() {
          try {
            const res = await fetch("http://localhost:5000/api/stories/author/" + profile._id, {
                credentials: 'include'
            });
    
            if (!res.ok) {
              throw new Error("Failed to fetch works");
            }
    
            const data = await res.json();
            setWorks(data);
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        }
        if (profile != null) getWorks();
    }, [profile]);

    async function updateInfo() {
        setEditing(false);
        try {
            let payload = {
                bio: bio,
            };
            if (pfpLink) payload.pfpLink = pfpLink;
            if (bannerLink) payload.bannerLink = bannerLink;
            const res = await fetch("http://localhost:5000/api/users/me", {
                method: "PUT",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
    
            if (!res.ok) {
              throw new Error("Failed to update information");
            }
    
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleFollowToggle() {
        setIsFollowLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5000/api/users/${profile._id}/follow`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error("Failed to follow user");

            if (isFollowing) {
                setFollowersCount(prev => prev - 1);
                setIsFollowing(false);
            } else {
                setFollowersCount(prev => prev + 1);
                setIsFollowing(true);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsFollowLoading(false);
        }
    }

    
  if (loading) {
    return <div style={{ padding: "20px" }}>Loading profile...</div>;
  }

  if (error) {
    return <div style={{ padding: "20px", color: "red" }}>{error}</div>;
  }

    return (
        <div className="profile">
            {isMe ? <button id="profile-back" onClick={() => navigate('/dashboard')}>Back</button> : <></>}
            <img src={bannerLink} alt="Banner" id="profile-banner" />
            {editing ? 
            <form id="set-banner">
                <textarea style={{ width: '600px' }}
                    value={bannerLink}
                    onChange={(e) => setBannerLink(e.target.value)}
                    placeholder="Link to banner picture"
                />
            </form>
            : <></>}
            <img src={pfpLink} alt="Profile Pic" id="profile-pic"/>
            {editing ? 
            <form id="set-pfp">
                <textarea style={{ width: '300px' }}
                    value={pfpLink}
                    onChange={(e) => setPfpLink(e.target.value)}
                    placeholder="Link to profile picture"
                />
            </form>
            : <></>}
            <div className="profile-top">
                <h2 id="profile-username">{profile.username}</h2>
                    {!editing ? 
                    <h3 id="profile-description">{bio}</h3> :
                    <form>
                        <textarea style={{ width: '400px' }}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Write something about yourself!"
                            rows="2"
                        />
                    </form>
                    }
                <h3 id="profile-works-created"><strong>Works created:</strong> {works.length}</h3>
                
                <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                    <span style={{ fontSize: '1.2rem' }}><strong>{followersCount}</strong> Followers</span>
                    <span style={{ fontSize: '1.2rem' }}><strong>{followingCount}</strong> Following</span>
                </div>
            </div>
            <br />
            
            <div className="profile-edit-button">
                {isMe ? (
                    !editing ? 
                        <button style={{ fontSize: '15px' }} onClick={() => setEditing(true)}>Edit Bio</button>
                    :
                        <button style={{ fontSize: '15px' }} onClick={() => updateInfo()}>Save</button>
                ) : (
                    <button 
                        style={{ 
                            fontSize: '15px', 
                            padding: '8px 16px',
                            backgroundColor: isFollowing ? '#e4e6eb' : '#007bff', 
                            color: isFollowing ? 'black' : 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }} 
                        onClick={handleFollowToggle}
                        disabled={isFollowLoading}
                    >
                        {isFollowLoading ? "..." : isFollowing ? "Following" : "Follow"}
                    </button>
                )}
            </div>
            
            <hr></hr>
            <h2 id="profile-my-stories">{isMe ? "My stories" : "Stories"}</h2>
            <div className="profile-stories">
                
                {works.map((work) => (
                    <ProfileStory
                    key={work._id || work.title}
                    image={"https://static.vecteezy.com/system/resources/thumbnails/002/219/582/small/illustration-of-book-icon-free-vector.jpg"}
                    title={work.title}
                    author={profile.username}
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                    />
                ))}
                
            </div>
        </div>
    );
}