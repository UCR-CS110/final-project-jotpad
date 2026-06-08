import { useState, useEffect } from 'react';
import './Drafts.css'

function Draft({draft}) {
    const [title, setTitle] = useState(draft.title);
    const [content, setContent] = useState(draft.content);
    const [tagsInput, setTagsInput] = useState((draft.tags).toString());
    const [status, setStatus] = useState(draft.status);
    const [wordCount, setWordCount] = useState(draft.wordCount);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [remove, setRemove] = useState(false);

    useEffect(() => {
        const wc = content.trim() ? content.trim().split(/\s+/).length : 0;
        setWordCount(wc);
    }, [content]);

    async function editDraft(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        

        try {
            const me = await fetch("http://localhost:5000/api/users/me", {
                credentials: 'include'
            });
            const author = await me.json();

            const payload = {
                author,
                title,
                content,
                tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean),
                status,
                wordCount,
            };

            const res = await fetch("http://localhost:5000/api/stories/" + draft._id, {
                method: "PUT",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.status == "public") {
                setRemove(true);
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (remove) return (<></>);

    return (
        <form className="se-form" onSubmit={editDraft}>
                <label className="se-label">Title</label>
                <input
                    className="se-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <label className="se-label">Content</label>
                <textarea
                    className="se-textarea"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={14}
                    required
                />
                <div className="se-meta">{wordCount} words</div>

                <label className="se-label">Tags</label>
                <input
                    className="se-input"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                />

                <div className="se-row">
                    <label className="se-select-label">
                        Status
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="se-select"
                        >
                            {draft.status == "draft" ? <option value="draft">Draft</option> : <></>}
                            {draft.status == "in_review" ? <option value="in_review">In Review</option> : <></>}
                            <option value="public">Public</option>
                        </select>
                    </label>
                </div>

                {error && <div className="se-error">{error}</div>}

                <button className="se-button" type="submit" disabled={loading}>
                    {loading ? "Posting…" : "Edit Story"}
                </button>
            </form>
    );
}

export default function Drafts({}) {
    const [drafts, setDrafts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchDrafts() {
          try {
            const res = await fetch("http://localhost:5000/api/stories/drafts", {
                credentials: 'include',
            });

            if (!res.ok) {
              throw new Error("Failed to fetch drafts");
            }

            const drafts = await res.json();
        
            setDrafts(drafts);
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        }
    
        fetchDrafts();
    }, []);


    if (loading) {
        return <div style={{ padding: "20px" }}>Loading drafts...</div>;
    }

    if (error) {
        return <div style={{ padding: "20px", color: "red" }}>{error}</div>;
    }

    if (drafts.length == 0) {
        return <div style={{ padding: "20px" }}>There are no drafts currently.</div>;
    }


    return (
        <div>
            <br />
            {drafts.map((curDraft) => (
                <>
                <Draft draft={curDraft} />
                <br />
                </>
            ))}
        </div>
    )

}