import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import './RequestDetails.css'
import { useNavigate } from 'react-router-dom';

export default function RequestDetails({}) {
    const [messageVisible, setMessageVisible] = useState(false);
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    let params = useParams();
    const navigate = useNavigate();
    let requestMessage = <p id="beta-request-message"></p>
    if (messageVisible) {
        requestMessage = <p id="beta-request-message">Thank you for offering to beta read! You will receive a message in your inbox about next steps if the author accepts your request.</p>
    }

    useEffect(() => {
        async function sendRequestMessage() {
            try {
                const me = await fetch("http://localhost:5000/api/users/me", {
                    credentials: 'include'
                });
                const user = await me.json();

                const payload = {
                    subject: "New request to beta-read your story, " + info.title,
                    text: "You have received a new request to beta-read your story, " + info.title + "!. To view the requesting party's profile, click the link below.",
                    type: "Request to beta-read",
                    link: "/profile/"+user.username,
                    story: info.story,
                    beta_request: info,
                    sender: user
                };
                const res = await fetch("http://localhost:5000/api/inbox/" + info.author, {
                    method: "POST",
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });
        
                if (!res.ok) {
                  throw new Error("Failed to send request");
                }
        
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        
        if (messageVisible) sendRequestMessage();
    }, [messageVisible]);

    useEffect(() => {
        async function fetchInfo() {
            try {
                const res = await fetch("http://localhost:5000/api/stories/requests/" + params.id, {
                    credentials: 'include'
                });
        
                if (!res.ok) {
                  throw new Error("Failed to fetch request info");
                }
        
                const data = await res.json();
                setInfo(data);
            } catch (err) {
                setError(err.message);
            } finally {
            setLoading(false);
            }
        }
        
        fetchInfo();
    }, []);

    if (loading) {
        return <div style={{ padding: "20px" }}>Loading profile...</div>;
    }

    if (error) {
        return <div style={{ padding: "20px", color: "red" }}>{error}</div>;
    }

    let button;
    if (info.vetting == 1) button = <button id="request-to-beta" onClick={() => setMessageVisible(true)}>Request to beta read</button>
    else button = <button id="request-to-beta">Go to story</button>

    return (
        <div>
        <button onClick={() => navigate('/betarequests')}>Back</button>
    <div className="request-details">
        <h2>{params.id}</h2>
        <h3>{info.genre}</h3>
        <p>{info.summary}</p>
        {requestMessage}
        {button}
    </div>
    </div>
    );
}