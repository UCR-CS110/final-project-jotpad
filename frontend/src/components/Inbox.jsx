import { useState } from 'react';
import { Link } from 'react-router-dom';
import "./Inbox.css"

function Message({subject, from, date, blurb, setVisible }) {
    function changeWidth() {
        const messages = document.getElementsByClassName("inbox-message");
        for (let message of messages) {
            message.style.width = '300px';
        }
    }
    return (
        <div className="inbox-message" onClick={() => {setVisible(1); changeWidth()}}>
            <h2>{subject}</h2>
            <p>{from}</p>
            <p>{date}</p>
            <br />
            <p>{blurb}</p>
        </div>
    );
}

function FullMessage({subject, from, date, message}) {
    return (
        <div class="full-message">
            <h2>{subject}</h2>
            <p>{from}</p>
            <p>{date}</p>
            <br />
            <p>{message}</p>
            <Link to="/story" style={{ color: 'red', textDecoration: 'none' }}>Read Story</Link>
        </div>
    );
}

//some function to load the blurbs of all the messages when page loads
//some function to call the api and get the full message when it's clicked on?


export default function Inbox({}) {
    const [currentMessage, setCurrentMessage] = useState(null);
    const [fullVisible, setFullVisible] = useState(false);

    let fullMessage;
    if (fullVisible) {
        fullMessage = <FullMessage subject="Offer for beta reading accepted" from="SwedishFish" date="01/24/2026" message="Your offer to beta-read The Martian City has been accepted! Click here to read the story:" />
    }

    return (

        <div class="inbox">
        <h1>Inbox</h1>

        <div class="inbox-all">
        <Message subject="Offer for beta reading accepted" from="SwedishFish" date="01/24/2026" blurb="Your offer to beta-read The Martian City has been accepted!..." setVisible={setFullVisible} />

        <div class="full-message-display">
            {fullMessage}
        </div>

        </div>

        </div>

    );

}