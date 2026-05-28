import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./StoryEditor.css";

export default function StoryEditor() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tagsInput, setTagsInput] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
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

        const user = await fetch("http://localhost:5000/api/users/me");
        const author = await user.json();

        const payload = {
            author,
            title,
            content,
            tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean),
            isPrivate,
            status,
            wordCount,
        };

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/stories", {
                method: "POST",
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

            const data = await res.json();
            setTitle("");
            setContent("");
            setTagsInput("");
            setStatus("draft");
            setIsPrivate(false);
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
                    <label className="se-checkbox">
                        <input
                            type="checkbox"
                            checked={isPrivate}
                            onChange={(e) => setIsPrivate(e.target.checked)}
                        />
                        Private (unpublished)
                    </label>

                    <label className="se-select-label">
                        Status
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="se-select"
                        >
                            <option value="draft">Draft</option>
                            <option value="in_review">In Review</option>
                            <option value="public">Public</option>
                        </select>
                    </label>
                </div>

                {error && <div className="se-error">{error}</div>}

                <button className="se-button" type="submit" disabled={loading}>
                    {loading ? "Posting…" : "Post Story"}
                </button>
            </form>
        </div>
    );
}