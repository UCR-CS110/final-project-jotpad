import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./RequestListing.css"

function BetaRequest({title, id, genre, tags, words, feedbackTypes }) {
    return (
        <div className="beta-request">
            <h2>{title}</h2>
            <p>{genre}</p>
            <p>{id}</p>
            <p>{tags.map(tag => (<>{tag}, </>))}</p>
            <p>{words} words</p>

        </div>
    );
}

export default function RequestListing({}) {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

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
            <input 
                type="text" 
                id="beta-request-search" 
                placeholder="Search requests by name" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button>Search</button>

            <hr />

            {loading && <p style={{ textAlign: 'center' }}>Searching stories...</p>}
            {error && <p style={{ textAlign: 'center', color: 'red' }}>Error: {error}</p>}

            <div class="beta-requests-table">
                
                {!loading && !error && requests.map((request) => (
                    <Link to={"/requests/" + request._id} key={request._id} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <BetaRequest 
                            title={request.title || "Sin título"} 
                            id={request._id} 
                            genre={request.genre || "General"} 
                            tags={request.tags || []} 
                            words={request.wordCount || 0} 
                        />
                    </Link>
                ))}
            </div>
            

        </div>
    );

}