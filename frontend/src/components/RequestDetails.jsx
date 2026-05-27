import { useState } from 'react';
import { useParams } from 'react-router';
import './RequestDetails.css'
import { useNavigate } from 'react-router-dom';

export default function RequestDetails({}) {
    const [messageVisible, setMessageVisible] = useState(false);
    let params = useParams();
    const navigate = useNavigate();
    let requestMessage = <p id="beta-request-message"></p>
    if (messageVisible) {
        requestMessage = <p id="beta-request-message">Thank you for offering to beta read! You will receive a message in your inbox about next steps if the author accepts your request.</p>
    }
    /*async function sendRequestMessage() {
        try {
            const res = await fetch("/api/messages/"),
            {
                method: 'POST',

                body: JSON.stringify({
                    body: "Offer"
                })
            }
        } catch (error) {

        }
    };*/
    return (
        <div>
        <button onClick={() => navigate('/betarequests')}>Back</button>
    <div className="request-details">
        <h2>{params.id}</h2>
        {requestMessage}
        <button id="request-to-beta" onClick={() => setMessageVisible(true)}>Request to beta read</button>
    </div>
    </div>
    );
}