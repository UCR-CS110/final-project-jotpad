import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./Inbox.css"

function FullMessage({message, setMessage, accepted}) {
    const [error, setError] = useState(null);
    
    const [rating, setRating] = useState(0);
    const [ratingSubmitted, setRatingSubmitted] = useState(false);
    const [isSubmittingRating, setIsSubmittingRating] = useState(false);

    async function sendAcceptMessage() {
        try {
            const setAccept = await fetch("http://localhost:5000/api/inbox/messageAccept/" + message._id, {
                method: "PUT",
                credentials: 'include'
            });
            if (setAccept.ok) {
                let button = document.getElementById("accept-request-button");
                button.disabled = true;
            }

            const me = await fetch("http://localhost:5000/api/users/me", {
                credentials: 'include'
            });
            const user = await me.json();

            const request = await fetch("http://localhost:5000/api/stories/requests/" + message.beta_request, {
                credentials: 'include'
            });
            const betaRequest = await request.json();

            const payload = {
                subject: "Request to beta-read story " + betaRequest.title + " has been accepted",
                text: "Your request to beta-read the story " + betaRequest.title + " has been accepted. To read the story and leave feedback, click the link below.",
                date: Date().toLocaleString(),
                type: "Request to beta read accepted",
                link: "/story/" + betaRequest.story,
                story: message.story,
                beta_request: message.beta_request,
                sender: user
            };
            const res = await fetch("http://localhost:5000/api/inbox/" + message.sender, {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
        
            if (!res.ok) {
                throw new Error("Failed to send acceptance message");
            }
        
        } catch (err) {
            setError(err.message);
        }
    }

    async function submitRating(selectedRating) {
        setIsSubmittingRating(true);
        setError(null);
        
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5000/api/users/${message.sender}/rate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ rating: selectedRating, messageId: message._id })
            });

            if (!res.ok) throw new Error("Failed to submit rating.");

            setRating(selectedRating);
            setRatingSubmitted(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmittingRating(false);
        }
    }

    if (error) {
        return <div style={{ padding: "20px", color: "red" }}>{error}</div>;
    }

    let ratingSection = null;
    if (message.type === "Feedback received") {
        if (ratingSubmitted) {
            ratingSection = (
                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#eef8eb', borderRadius: '5px', marginLeft: '10px' }}>
                    <p style={{ margin: 0, color: '#28a745', fontWeight: 'bold' }}>
                        You rated this feedback {rating} out of 5 stars.
                    </p>
                </div>
            );
        } else {
            ratingSection = (
                <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f9f9f9', marginLeft: '10px' }}>
                    <h4 style={{ margin: '0 0 10px 0' }}>Rate this feedback:</h4>
                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '10px' }}>
                        Did you find this review helpful? Your rating will appear on the beta reader's public profile.
                    </p>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button 
                                key={star}
                                onClick={() => submitRating(star)}
                                disabled={isSubmittingRating}
                                style={{
                                    fontSize: '1.5rem',
                                    background: 'none',
                                    border: 'none',
                                    cursor: isSubmittingRating ? 'not-allowed' : 'pointer',
                                    color: rating >= star ? '#ffc107' : '#ccc'
                                }}
                                onMouseEnter={() => !ratingSubmitted && setRating(star)}
                                onMouseLeave={() => !ratingSubmitted && setRating(0)}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                    {isSubmittingRating && <span style={{ fontSize: '0.8rem', color: 'gray' }}>Saving...</span>}
                </div>
            );
        }
    }

    return (
        <div className="full-message">
            <div className="subject-line-full">
                <h2 style={{ paddingLeft: '10px' }}>{message.subject}</h2>
                <button className="full-message-x" onClick={() => {setMessage(null)}}>X</button>
            </div>
            <p style={{ paddingLeft: '10px' }}>Admin</p>
            <p style={{ paddingLeft: '10px' }}>Sent: {message.date}</p>
            <br />
            <p style={{ paddingLeft: '10px', whiteSpace: 'pre-wrap' }}>{message.text}</p>
            <Link to={message.link} style={{ color: 'red', textDecoration: 'none', paddingLeft: '10px' }}>{(message.type == "Request to beta read accepted") ? "View work" : "Visit profile"}</Link>
            <br /> <br />
            
            {accepted ? <button disabled style={{ marginLeft: '10px' }}>You have already accepted the request.</button> : (message.type == "Request to beta-read") ? <button onClick={() => sendAcceptMessage()} style={{ marginLeft: '10px' }} id="accept-request-button">Click here to accept the request.</button> : <></>}
        
            {ratingSection}
        </div>
    );
}

export default function Inbox({}) {
    const [inbox, setInbox] = useState(null);
    const [currentMessage, setCurrentMessage] = useState(null);
    const [fullMessage, setFullMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchInbox() {
          try {
            const res = await fetch("http://localhost:5000/api/inbox", {
                credentials: 'include',
            });
      
            if (!res.ok) {
              throw new Error("Failed to fetch inbox");
            }
      
            const data = await res.json();
              
            setInbox(data);

          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        }
          
        fetchInbox();
    }, []);

    useEffect(() => {
        async function updateFullMessage() {
            if (currentMessage) {
                setFullMessage(<FullMessage message={currentMessage} setMessage={setCurrentMessage} accepted={currentMessage.accepted}/>);
            } else {
                setFullMessage(null);
            }
        }
        updateFullMessage();
        
    }, [currentMessage]);

    const navigate = useNavigate();

    if (loading) {
        return <div style={{ padding: "20px" }}>Loading profile...</div>;
    }

    if (error) {
        return <div style={{ padding: "20px", color: "red" }}>{error}</div>;
    }

    return (

        <div className="inbox">
        <h1>Inbox</h1>

        <button id="inbox-back" onClick={() => navigate('/dashboard')}>Back</button>

        {inbox.length == 0 ? <div style={{ padding: "20px" }}>There are no messages currently.</div> : <></>}
        <div className="inbox-all">
        <div className="inbox-blurbs">{inbox.map((message) => (
            <div className="inbox-message" onClick={() => {setCurrentMessage(message);}}>
            <h2 style={{ paddingLeft: '10px' }}>{message.subject}</h2>
            <p style={{ paddingLeft: '10px' }}>Admin</p>
            <p style={{ paddingLeft: '10px' }}>Sent: {message.date}</p>
            <br />
            <p style={{ paddingLeft: '10px' }}>{message.text}</p>
            </div>
        ))}
        </div>

        <div className="full-message-display">
            {fullMessage}
        </div>

        </div>

        </div>

    );

}