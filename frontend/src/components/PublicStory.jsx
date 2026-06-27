
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';

export default function PublicStory({}) {
    const [story, setStory] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stars, setStars] = useState(0);
    const [newRating, setNewRating] = useState(true);
    const [disabled, setDisabled] = useState(true);
    const [submittedMessage, setSubmittedMessage] = useState(null);

    let params = useParams();

    useEffect(() => {
        const fetchStory = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/stories/" + params.id);
                    
                if (!response.ok) {
                    throw new Error("Could not find this story.");
                }
                    
                const data = await response.json();
                setStory(data);
                    
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const getCurrentRating = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/stories/rating/me/" + params.id, {
                    credentials: 'include'
                });
                    
                if (!response.ok) {
                    throw new Error("Could not get rating.");
                }
                    
                const data = await response.json();
                if (data.stars != "none") {
                    setStars(data.stars);
                    setRating(data.stars);
                    setNewRating(false);
                }
                    
            } catch (err) {
                console.log(err.message);
            }
        };
    
        fetchStory();
        getCurrentRating();
    }, []);

    async function rateStory() {
            try {
                if (newRating) {
                    const res = await fetch("http://localhost:5000/api/stories/rating/" + params.id, {
                    method: "POST",
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ rating: stars })
                    });
                    if (!res.ok) {
                        throw new Error("Could not post the rating.");
                    }
                    
                    const data = await res.json();
                    setSubmittedMessage(<p style={{ color: 'green', justifySelf: 'center', fontSize: '18px' }}>Thank you for rating the story!</p>);
                    setNewRating(false);
                } else {
                    const res = await fetch("http://localhost:5000/api/stories/rating/" + params.id, {
                    method: "PUT",
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ rating: stars })
                    });
                    if (!res.ok) {
                        throw new Error("Could not post the rating.");
                    }
                    
                    const data = await res.json();
                    setSubmittedMessage(<p style={{ color: 'green', justifySelf: 'center', fontSize: '18px' }}>Your rating has been successfully changed.</p>);
                }

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
    }

    function setRating(rating) {
        setStars(rating);
        let submitButton = document.getElementById("stars-submit");
        submitButton.disabled = false;
        setDisabled(false);
        for (let i = 1; i <= rating; i++) {
            let button = document.getElementById("star-"+i);
            button.style.color = '#e0d236';
        }
        for (let i = rating+1; i <= 5; i++) {
            let button = document.getElementById("star-"+i);
            button.style.color = 'gray';
        }

    }

    if (loading) {
        return <div style={{ padding: "20px" }}>Loading story...</div>;
    }

    if (error) {
        return <div style={{ padding: "20px", color: "red" }}>{error}</div>;
    }

    return  (
        <>
        <div style={{ marginTop: '40px', padding: '40px', backgroundColor: '#efe3e3', width: '1200px', justifySelf: 'center' }}>
            <h1 style={{ borderBottom: '3px solid black', justifySelf: 'center' }}>{story.title}</h1>
            <p style={{ fontStyle: 'italic', fontSize: '1.1rem', justifySelf: 'center' }}>Words: {story.wordCount}</p>

            <hr />

            <div style={{ whiteSpace: 'pre-wrap', fontSize: '1.2rem', padding: '40px' }}>
                {story.content}
            </div>
            
            <hr />
        </div>
        <div style={{ justifySelf: 'center' }}>
            <h3 style={{ justifySelf: 'center' }}>Liked the story? Give it a rating!</h3>
            <button id="star-1" style={{ color: 'gray', backgroundColor: 'white', border: 'none', fontSize: '30px' }} onClick={() => setRating(1)}>★</button>
            <button id="star-2" style={{ color: 'gray', backgroundColor: 'white', border: 'none', fontSize: '30px' }} onClick={() => setRating(2)}>★</button>
            <button id="star-3" style={{ color: 'gray', backgroundColor: 'white', border: 'none', fontSize: '30px' }} onClick={() => setRating(3)}>★</button>
            <button id="star-4" style={{ color: 'gray', backgroundColor: 'white', border: 'none', fontSize: '30px' }} onClick={() => setRating(4)}>★</button>
            <button id="star-5" style={{ color: 'gray', backgroundColor: 'white', border: 'none', fontSize: '30px' }} onClick={() => setRating(5)}>★</button>
            {disabled ? 
            <button id="stars-submit" style={{ marginLeft: '10px', fontSize: '18px', backgroundColor: '#69bc4e' }} disabled>Submit</button>
            : <button id="stars-submit" style={{ marginLeft: '10px', fontSize: '18px', backgroundColor: '#69bc4e' }} onClick={() => rateStory()}>{newRating ? "Submit" : "Edit rating"}</button>}
            {submittedMessage}
            </div>
        </>
    );

}