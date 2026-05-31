import banner from '../assets/banner.jpg';
import pfp from '../assets/pfp.webp';
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

    
  if (loading) {
    return <div style={{ padding: "20px" }}>Loading profile...</div>;
  }

  if (error) {
    return <div style={{ padding: "20px", color: "red" }}>{error}</div>;
  }

    return (
        <div className="profile">
            {isMe ? <button id="profile-back" onClick={() => navigate('/dashboard')}>Back</button> : <></>}
            <img src={banner} alt="Banner" id="profile-banner" />
            <img src={pfp} alt="Profile Pic" id="profile-pic"/>
            <div className="profile-top">
                <h2 id="profile-username">{profile.username}</h2>
                <h3 id="profile-description">Moo. (?)</h3>
                <h3 id="profile-works-created"><strong>Works created:</strong> {works.length}</h3>
            </div>


            <hr></hr>
            <h2 id="profile-my-stories">My stories</h2>
            <div className="profile-stories">
                
                {works.map((work) => (
                    <ProfileStory
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