import banner from '../assets/banner.jpg';
import pfp from '../assets/pfp.webp';
import { useState, useEffect } from 'react';
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
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

     useEffect(() => {
        async function fetchProfile() {
          try {
            const res = await fetch("/api/users/me");
    
            if (!res.ok) {
              throw new Error("Failed to fetch profile");
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
    return <div style={{ padding: "20px" }}>Loading profile...</div>;
  }

  /*if (error) {
    return <div style={{ padding: "20px", color: "red" }}>{error}</div>;
  }*/

    return (
        <div className="profile">
            <button id="profile-back" onClick={() => navigate('/dashboard')}>Back</button>
            <img src={banner} alt="Banner" id="profile-banner" />
            <img src={pfp} alt="Profile Pic" id="profile-pic"/>
            <div className="profile-top">
                <h2 id="profile-username">TenaciousAlpaca</h2>
                <h3 id="profile-description">Moo. (?)</h3>
                <h3 id="profile-works-created"><strong>Works created:</strong> 3</h3>
            </div>


            <hr></hr>
            <h2 id="profile-my-stories">My stories</h2>
            <div className="profile-stories">
                

                <ProfileStory
                    image={"https://static.vecteezy.com/system/resources/thumbnails/002/219/582/small/illustration-of-book-icon-free-vector.jpg"}
                    title="Title 1"
                    author="me"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                />

                <ProfileStory
                    image={"https://static.vecteezy.com/system/resources/thumbnails/002/219/582/small/illustration-of-book-icon-free-vector.jpg"}
                    title="Title 2"
                    author="me"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                />

                <ProfileStory
                    image={"https://static.vecteezy.com/system/resources/thumbnails/002/219/582/small/illustration-of-book-icon-free-vector.jpg"}
                    title="Title 3"
                    author="me"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                />
                
            </div>


        </div>
    );

}