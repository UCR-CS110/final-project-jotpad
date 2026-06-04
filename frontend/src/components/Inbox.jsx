import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./Inbox.css"

function FullMessage({message, setMessage}) {
    const [error, setError] = useState(null);
    const [accepted, setAccepted] = useState(message.accepted);

    async function sendAcceptMessage() {
        try {
            const setAccept = await fetch("http://localhost:5000/api/inbox/messageAccept/" + message._id, {
                method: "PUT",
                credentials: 'include'
            });
            if (setAccept.ok) setAccepted(true);

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
                type: "Request to beta read accepted",
                link: "tba",
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

    if (error) {
        return <div style={{ padding: "20px", color: "red" }}>{error}</div>;
    }

    let accept;
    if (accepted) {
        accept = <button disabled>You have already accepted the request.</button>;
    } else if (message.type == "Request to beta-read") accept = <button onClick={() => sendAcceptMessage()}>Click here to accept the request.</button>;
    return (
        <div className="full-message">
            <div className="subject-line-full">
                <h2>{message.subject}</h2>
                <button className="full-message-x" onClick={() => {setMessage(null)}}>X</button>
            </div>
            <p>Admin</p>
            <p>date</p>
            <br />
            <p>{message.text}</p>
            <Link to={message.link} style={{ color: 'red', textDecoration: 'none' }}>{(message.type == "Request to beta read accepted") ? "View work" : "Visit profile"}</Link>
            <br /> <br />
            {accept}
        </div>
    );
}

export default function Inbox({}) {
    const [inbox, setInbox] = useState(null);
    const [currentMessage, setCurrentMessage] = useState(null);
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

    const navigate = useNavigate();

    let fullMessage;
    if (currentMessage != null) {
        fullMessage = <FullMessage message={currentMessage} setMessage={setCurrentMessage} />
        //subject="Offer for beta reading accepted" from="SwedishFish" date="01/24/2026" message="Your offer to beta-read The Martian City has been accepted! Click here to read the story:" setVisible={setFullVisible}/>
    }

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

        <div className="inbox-all">
        <div className="inbox-blurbs">{inbox.map((message) => (
            <div className="inbox-message" onClick={() => {setCurrentMessage(message);}}>
            <h2>{message.subject}</h2>
            <p>Admin</p>
            <p>date</p>
            <br />
            <p>{message.text}</p>
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