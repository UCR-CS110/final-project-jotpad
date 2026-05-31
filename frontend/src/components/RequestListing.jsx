import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./RequestListing.css"

function BetaRequest({title, id, genre, tags, words, feedbackTypes, link }) {
    return (
        <tr className="beta-request">
            <td className="request-title">{title}</td>
            <td className="request-genre">{genre}</td>
            <td className="request-id">{id}</td>
            <td className="request-tags">{tags.map(tag => (<>{tag}, </>))}</td>
            <td className="request-words">{words} words</td>
            <td className="request-link"><Link to={link} key={id} style={{ textDecoration: 'none', color: 'inherit' }}>See page</Link></td>

        </tr>
    );
}

export default function RequestListing({}) {
    const [add, setAdd] = useState(true);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [addOptions, setAddOptions] = useState(false);
    const [drafts, setDrafts] = useState([]);
    const [fields, setFields] = useState(null);
    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState('');
    const [tags, setTags] = useState('');
    const [summary, setSummary] = useState('');
    const [vetting, setVetting] = useState(true);
    const [requestSubmitted, setRequestSubmitted] = useState(false);


    let add_button;
    if (add == true) {
        add_button = <button id="add-request-button" onClick={() => setAddOptions(true)}>Add request</button>
    } else {
        add_button = <button id="add-request-button" disabled>Add request</button>
    }

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/stories/drafts", {
                    credentials: 'include'
                });
                if (!res.ok) throw new Error("We couldn't fetch your drafts.");

                const data = await res.json();
                setDrafts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (addOptions) fetchStories();
    }, [addOptions]);

    useEffect(() => {
        const setInfo = async () => {
            if (fields != null) {
                setTitle(fields.title);
                setTags((fields.tags).toString());
            }
            setSummary('');
            setGenre('');
            setVetting(true);
        };
        
        setInfo();
    }, [fields]);
    

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/stories/requests');
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

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const me = await fetch("http://localhost:5000/api/users/me", {
                credentials: 'include'
            });
            const author = await me.json();

            const payload = {
                title,
                genre,
                id: fields._id,
                tags: tags.split(",").map(t => t.trim()).filter(Boolean),
                words: fields.wordCount,
                summary,
                author,
                story: fields,
                vetting: vetting
            };

            const res = await fetch("http://localhost:5000/api/stories/requests/" + fields._id, {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            console.log(data);

            setFields(null);
            setAddOptions(false);
            setRequestSubmitted(true);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    let requestSuccessful;
    if (requestSubmitted) requestSuccessful = <p style={{ fontSize: '18px', color: 'green' }}>Your request has been successfully posted!</p>


    const filteredRequests = requests.filter(request => {
        const titleMatch = (request.title || "").toLowerCase().includes(searchTerm.toLowerCase());
        return titleMatch;
    });
    
    return (
        <div>
            <div className="requests-search">
                <input 
                type="text" 
                id="beta-request-search" 
                placeholder="Search requests by name" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button id="requests-search-button">Search</button>
            </div>

            <div className="add-request">
                {add_button}
            </div>
            {addOptions ?
            <div>{drafts.map((draft) => (
                <div>
                    <input type="radio" id={draft._id} name="story-selection" value={draft._id} onClick={() => setFields(draft)}></input>
                    <label htmlFor={draft._id} style={{ fontSize: '18px' }}>{draft.title}</label>
                <br />
                </div>
                ))}
            </div> 
            : <></>}
            <br />
            {fields ? 
            <div>
                <form className="se-form" onSubmit={handleSubmit}>
                <label className="se-label">Title</label>
                <input
                    className="se-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <label className="se-label">Summary</label>
                <textarea
                    className="se-textarea"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    rows={14}
                    required
                />

                <label className="se-label">Genre</label>
                <input
                    className="se-input"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                />

                <label className="se-label">Tags</label>
                <input
                    className="se-input"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />

                <label className="se-checkbox">
                    <input
                        type="checkbox"
                        checked={vetting}
                        onChange={(e) => setVetting(e.target.checked)}
                    />
                    Require vetting of reviewers
                </label>

                <button className="se-button" type="submit" disabled={loading}>
                    {loading ? "Posting…" : "Post Request"}
                </button>
            </form>
            </div>
            :
            <></>}
            {requestSuccessful}
            

            <hr />

            <table className="beta-requests-table">
                <thead>
                    <tr>
                    <th>Title</th>
                    <th>Genre</th>
                    <th>ID</th>
                    <th>Tags</th>
                    <th>Words</th>
                    <th>View</th>
                </tr>
                </thead>
                
                <tbody>
                
                {!loading && !error && requests.map((request) => (
                    <BetaRequest 
                            title={request.title || "Sin título"} 
                            id={request._id} 
                            genre={request.genre || "General"} 
                            tags={request.tags || []} 
                            words={request.words || 0} 
                            link={"/requests/"+request._id}
                    />
                ))}
                </tbody>
            </table>

            {loading && <p style={{ textAlign: 'center' }}>Searching stories...</p>}
            {error && <p style={{ textAlign: 'center', color: 'red' }}>Error: {error}</p>}

                
                
            

        </div>
    );

}