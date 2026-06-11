import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Drafts.css'

export default function Drafts() {
    const [selectedDraft, setSelectedDraft] = useState(null);
    const [drafts, setDrafts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Form state
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const [status, setStatus] = useState('draft');
    const [wordCount, setWordCount] = useState(0);
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState(null);
    const [remove, setRemove] = useState(false);

    // Fetch drafts on mount
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
                if (drafts.length > 0) setSelectedDraft(drafts[0]);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchDrafts();
    }, []);

    // Sync form state when selectedDraft changes
    useEffect(() => {
        if (selectedDraft) {
            setTitle(selectedDraft.title);
            setContent(selectedDraft.content);
            setTagsInput((selectedDraft.tags).toString());
            setStatus(selectedDraft.status);
            setWordCount(selectedDraft.wordCount);
            setFormError(null);
            setRemove(false);
        }
    }, [selectedDraft]);

    // Update word count when content changes
    useEffect(() => {
        const wc = content.trim() ? content.trim().split(/\s+/).length : 0;
        setWordCount(wc);
    }, [content]);

    // Handle form submission
    async function handleEditDraft(e) {
        e.preventDefault();
        setFormError(null);
        setFormLoading(true);

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

            const res = await fetch("http://localhost:5000/api/stories/" + selectedDraft._id, {
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
            setFormError(err.message);
        } finally {
            setFormLoading(false);
        }
    }

    if (loading) {
        return <div style={{ padding: "20px" }}>Loading drafts...</div>;
    }

    if (error) {
        return <div style={{ padding: "20px", color: "red" }}>{error}</div>;
    }

    if (drafts.length == 0) {
        return <div style={{ padding: "20px" }}>There are no drafts currently.</div>;
    }

    if (remove) {
        return <div style={{ padding: "20px" }}>Draft published! Redirecting...</div>;
    }

    return (
        <div className="drafts-page">
            <aside className="drafts-sidebar">
                <h3>My Drafts</h3>
                {drafts.map((draft) => (
                    <button
                        key={draft._id}
                        className={draft._id === selectedDraft?._id ? "draft-tab active" : "draft-tab"}
                        onClick={() => setSelectedDraft(draft)}
                    >
                        {draft.title || "Untitled"}
                    </button>
                ))}
            </aside>

            <main className="drafts-editor">
                {selectedDraft ? (
                    <form className="se-form" onSubmit={handleEditDraft}>
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
                            <label style={{marginLeft: "0px"}} className="se-select-label">
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="se-select"
                                >
                                    {selectedDraft.status == "draft" ? <option value="draft">Draft</option> : <></>}
                                    {selectedDraft.status == "in_review" ? <option value="in_review">In Review</option> : <></>}
                                    <option value="public">Public</option>
                                </select>
                            </label>
                        </div>

                        {formError && <div className="se-error">{formError}</div>}

                        <button className="se-button" type="submit" disabled={formLoading}>
                            {formLoading ? "Saving…" : "Edit Story"}
                        </button>
                    </form>
                ) : (
                    <div>Select a draft to edit.</div>
                )}
            </main>
        </div>
    );
}