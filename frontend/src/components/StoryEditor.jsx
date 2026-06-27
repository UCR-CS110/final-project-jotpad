import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./StoryEditor.css";

export default function StoryEditor() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tagsInput, setTagsInput] = useState("");
    const [status, setStatus] = useState("draft");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [wordCount, setWordCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const wc = content.trim() ? content.trim().split(/\s+/).length : 0;
        setWordCount(wc);
    }, [content]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const user = await fetch("http://localhost:5000/api/users/me", {
            credentials: 'include'
        });
        const author = await user.json();

        const payload = {
            author,
            title,
            content,
            tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean),
            status,
            wordCount,
        };

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/api/stories", {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.message || "Failed to post story");
            }

            setTitle("");
            setContent("");
            setTagsInput("");
            setStatus("draft");
            alert("Story posted!");
            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="story-editor">
            <h2 className="se-title">Write a Story</h2>

            <form className="se-form" onSubmit={handleSubmit}>
                
                <div>
                    <label className="se-label">Title</label>
                    <input
                        className="se-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Give your story a title..."
                        required
                    />
                </div>

                <div>
                    <label className="se-label">Content</label>
                    <textarea
                        className="se-textarea"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Start typing your story here..."
                        rows={16}
                        required
                    />
                    <div className="se-meta">{wordCount} words</div>
                </div>

                <div className="se-bottom-row">
                    <div className="se-tags-group">
                        <label className="se-label">Tags</label>
                        <input
                            className="se-input"
                            value={tagsInput}
                            onChange={(e) => setTagsInput(e.target.value)}
                            placeholder="e.g. fantasy, romance, dark"
                        />
                    </div>

                    <div className="se-status-group">
                        <label className="se-label">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="se-select"
                        >
                            <option value="draft">Draft</option>
                            <option value="public">Public</option>
                        </select>
                    </div>
                </div>

                {error && <div className="se-error">{error}</div>}

                <button className="se-button" type="submit" disabled={loading}>
                    {loading ? "Posting…" : "Post Story"}
                </button>
            </form>
        </div>
    );
}