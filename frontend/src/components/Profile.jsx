import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useNavigate, Link } from 'react-router-dom';
import './Profile.css'

function ProfileStory({ image, title, id, author, wordCount, description }) {
    return (
        <div className="profile-story">
            <img src={image} alt="story-cover1" className="profile-story-cover" />
            <div className="profile-story-info">
                <h2 className="profile-story-title">{title}</h2>
                <p className="profile-story-author">By <Link to={"/profile/"+author}>{author}</Link></p>
                <p className="profile-story-description">Word count: {wordCount} | {description}...</p>
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
            if (data.username == params.username) {
                setProfile(data);
                setBio(data.bio);
                if (data.pfpLink) setPfpLink(data.pfpLink);
                if (data.bannerLink) setBannerLink(data.bannerLink);
                setIsMe(true);
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
            }

          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        }
    
        fetchProfile();
    }, []);

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
            </div>
            <br />
            <div className="profile-edit-button">{isMe ? !editing ? 
            <button style={{ fontSize: '15px' }} onClick={() => setEditing(true)}>Edit Bio</button>
                :
            <button style={{ fontSize: '15px' }} onClick={() => updateInfo()}>Save</button>
            : <></>}</div>
            <hr></hr>
            <h2 id="profile-my-stories">My stories</h2>
            <div className="profile-stories">
                
                {works.map((work) => (
                    <ProfileStory
                    image={"https://static.vecteezy.com/system/resources/thumbnails/002/219/582/small/illustration-of-book-icon-free-vector.jpg"}
                    title={work.title}
                    id={work._id}
                    author={profile.username}
                    wordCount={work.wordCount}
                    description={work.content.slice(0, 100)}
                    />
                ))}
                
            </div>


        </div>
    );

}