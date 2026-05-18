import "./Inbox.css"

function Message({subject, from, date, blurb }) {
    return (
        <div class="inbox-message">
            <h2>{subject}</h2>
            <p>{from}</p>
            <p>{date}</p>
            <br />
            <p>{blurb}</p>
        </div>
    );
}


export default function Inbox({}) {

    return (

        <div class="inbox">
        <h1>Inbox</h1>

        <Message subject="Offer for beta reading accepted" from="SwedishFish" date="01/24/2026" message="Your offer to beta-read The Martian City has been accepted!..." />

        </div>

    );

}