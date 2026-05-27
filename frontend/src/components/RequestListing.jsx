import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./RequestListing.css"

function BetaRequest({title, id, genre, tags, words, feedbackTypes, link }) {
    return (
        <tr class="beta-request">
            <td class="request-title">{title}</td>
            <td class="request-genre">{genre}</td>
            <td class="request-id">{id}</td>
            <td class="request-tags">{tags.map(tag => (<>{tag}, </>))}</td>
            <td class="request-words">{words} words</td>
            <td class="request-link"><Link to={link} key={id} style={{ textDecoration: 'none', color: 'inherit' }}>See page</Link></td>

        </tr>
    );
}

export default function RequestListing({}) {
    const [add, setAdd] = useState(false);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    let add_button;
    if (add == true) {
        add_button = <button id="add-request-button">Add request</button>
    } else {
        add_button = <button id="add-request-button" disabled>Add request</button>
    }
    

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/stories');
                if (!response.ok) throw new Error("We couldn't fetch the beta requests.");
                
                const data = await response.json();
                setRequests(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const filteredRequests = requests.filter(request => {
        const titleMatch = (request.title || "").toLowerCase().includes(searchTerm.toLowerCase());
        return titleMatch;
    });
    
    return (
        <div>
            <div class="requests-search">
                <input type="text" placeholder="Search requests by name" id="requests-search-input" />
                <button id="requests-search-button">Search</button>
            </div>

            <input 
                type="text" 
                id="beta-request-search" 
                placeholder="Search requests by name" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button>Search</button>

            <div class="add-request">
                {add_button}
            </div>
            

            <hr />

            <table class="beta-requests-table">
                <tr>
                    <th>Title</th>
                    <th>Genre</th>
                    <th>ID</th>
                    <th>Tags</th>
                    <th>Words</th>
                    <th>View</th>
                </tr>
                <BetaRequest title="WIP" id="001" genre="Science Fiction" tags={["Short story", "Aliens"]} words="3002" link={"/requests/"+"001"}/>
                
                <br />

                <BetaRequest title="wip2" id="002" genre="Fantasy" tags={["Serialized", "Fanfiction"]} words="60544" link={"/requests/"+"002"} />
                {!loading && !error && requests.map((request) => (
                    <BetaRequest 
                            title={request.title || "Sin título"} 
                            id={request._id} 
                            genre={request.genre || "General"} 
                            tags={request.tags || []} 
                            words={request.wordCount || 0} 
                            link={"/requests/"+request._id}
                    />
                ))}
            </table>

            {loading && <p style={{ textAlign: 'center' }}>Searching stories...</p>}
            {error && <p style={{ textAlign: 'center', color: 'red' }}>Error: {error}</p>}

                
                
            

        </div>
    );

}