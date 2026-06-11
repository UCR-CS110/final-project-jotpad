import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./RequestListing.css"

function BetaRequest({ title, id, genre, tags, words, feedbackTypes, link, isMine }) {
    return (
        <tr className="beta-request">
            <td className="request-title">{title}</td>
            <td className="request-genre">{genre}</td>
            <td className="request-id">{id}</td>
            <td className="request-tags">{tags.map((tag, index) => (<>{tag}{index == tags.length - 1 ? "" : ", "}</>))}</td>
            <td className="request-words">{words} words</td>
            <td className="request-link">
                {isMine ? (
                    <span style={{ color: 'gray', fontWeight: 'bold' }}>
                        Your Listing
                    </span>
                ) : (
                    <Link
                        to={link}
                        key={id}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        See page
                    </Link>
                )}
            </td>

        </tr>
    );
}

export default function RequestListing({ }) {
    const [add, setAdd] = useState(true);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeTag, setTypeTag] = useState("");
    const [searchTags, setSearchTags] = useState([]);
    const [searchGenre, setSearchGenre] = useState("");
    const [addOptions, setAddOptions] = useState(false);
    const [drafts, setDrafts] = useState([]);
    const [fields, setFields] = useState(null);
    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState('');
    const [tags, setTags] = useState('');
    const [summary, setSummary] = useState('');
    const [vetting, setVetting] = useState(true);
    const [requestSubmitted, setRequestSubmitted] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

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
                const response = await fetch('http://localhost:5000/api/stories/requests', {
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error("We couldn't fetch the beta requests.");
                }

                const data = await response.json();
                setRequests(data);

                const meRes = await fetch("http://localhost:5000/api/users/me", {
                    credentials: 'include'
                });

                const meData = await meRes.json();
                setCurrentUser(meData);
                setAdd(meData.credits >= 5);

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

    function addSearchTag() {
        let newSearchTags = searchTags.slice();
        if (typeTag != "") {
            newSearchTags.push(typeTag);
            setSearchTags(newSearchTags);
            setTypeTag("");
        }
    }

    function removeSearchTag(tag) {
        let newSearchTags = searchTags.slice();
        newSearchTags.splice(newSearchTags.indexOf(tag), 1);
        setSearchTags(newSearchTags);
    }

    let requestSuccessful;
    if (requestSubmitted) requestSuccessful = <p style={{ fontSize: '18px', color: 'green' }}>Your request has been successfully posted!</p>


    const filteredRequests = requests.filter(request => {
        const titleMatch = (request.title || "").toLowerCase().includes(searchTerm.toLowerCase());
        let tagsMatch = false;
        request.tags.forEach((tag) => {
            tagsMatch = tagsMatch || (searchTags.includes(tag));
        });
        tagsMatch = tagsMatch || (searchTags.length == 0);
        const genreMatch = (request.genre || "").toLowerCase().includes(searchGenre.toLowerCase());
        const allMatch = titleMatch && tagsMatch && genreMatch;
        return allMatch;
    });

    return (
        <div>
            <div className="requests-search">
                <input
                    type="text"
                    id="beta-request-search"
                    style={{ backgroundColor: '#e2f3e7', padding: '3px' }}
                    placeholder="Search requests by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="genre-search" style={{ justifySelf: 'center', marginBottom: '20px' }}>
                <input
                    type="text"
                    id="search-genre"
                    style={{ fontSize: '15px', backgroundColor: '#e2f3e7', padding: '3px' }}
                    placeholder="Search by genre"
                    value={searchGenre}
                    onChange={(e) => setSearchGenre(e.target.value)}
                />
            </div>

            <div className="filter-by-tags" style={{ justifySelf: 'center' }}>
                <input
                    type="text"
                    id="filter-tags"
                    style={{ fontSize: '15px', padding: '3px', backgroundColor: '#f7f3eb' }}
                    placeholder="Type tags"
                    value={typeTag}
                    onChange={(e) => setTypeTag(e.target.value)}
                />
                <button style={{ fontSize: '15px', backgroundColor: '#d4a861', padding: '5px' }} onClick={() => addSearchTag()}>Add tag</button>
            </div>

            <div style={{ justifySelf: 'center', fontSize: '15px', marginBottom: '20px' }}>
                {searchTags.map((searchTag) => (
                    <div style={{ marginBottom: '-20px' }}><p style={{ backgroundColor: 'orange', borderRadius: '15px', padding: '5px 10px', display: 'inline-block' }}>{searchTag}</p>
                        <button style={{ backgroundColor: 'red', border: 'none', marginLeft: '2px', borderRadius: '7px' }} onClick={() => removeSearchTag(searchTag)}>x</button></div>
                ))}
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

                    {!loading && !error && filteredRequests.map((request) => (
                        <BetaRequest
                            title={request.title || "Title not set"}
                            id={request._id}
                            genre={request.genre || "genre not set"}
                            tags={request.tags || []}
                            words={request.words || 0}
                            link={"/requests/" + request._id}
                            isMine={
                                String(request.author?._id || request.author) ===
                                String(currentUser?._id)
                            }
                        />
                    ))}
                </tbody>
            </table>

            {loading && <p style={{ textAlign: 'center' }}>Searching stories...</p>}
            {error && <p style={{ textAlign: 'center', color: 'red' }}>Error: {error}</p>}





        </div>
    );

}