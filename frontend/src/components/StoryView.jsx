import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function StoryView() {
    const { id } = useParams();

    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Feedback form states
    const [feedbackText, setFeedbackText] = useState("");
    const [feedbackStatus, setFeedbackStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchStory = async () => {
            try {
                // Ask the server for the story with this ID
                const response = await fetch(`http://localhost:5000/api/stories/${id}`);

                if (!response.ok) {
                    throw new Error("Could not find this story.");
                }

                const data = await response.json();
                setStory(data);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStory();
    }, [id]);


    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFeedbackStatus(null);

        try {
            const response = await fetch("/api/feedback", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    storyId: id,
                    content: feedbackText,
                }),
            });

            if (!response.ok) {
                const body = await response.text();
                throw new Error(body ? body : "Failed to submit feedback. Please try again.");
            }

            setFeedbackStatus("success");
            
            setFeedbackText("");
        } catch (err) {
            setFeedbackStatus(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}> Loading story... </div>;

    if (error) return <div style={{ textAlign: 'center', color: 'red', marginTop: '50px' }}>Error: {error}</div>;

    if (!story) return <div>Story not found.</div>;

    return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', backgroundColor: '#fdfbf7', minHeight: '100vh' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{story.title}</h1>
            <p style={{ color: 'gray', fontStyle: 'italic' }}>Words: {story.wordCount || "Desconocido"}</p>
            <hr style={{ margin: '20px 0' }} />

            <div style={{ whiteSpace: 'pre-wrap', fontSize: '1.2rem', lineHeight: '1.8' }}>
                {story.content}
            </div>

            <hr style={{ margin: '40px 0' }} />

            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                <h2 style={{ marginTop: '0' }}>Leave Feedback & Earn Credit</h2>
                <p style={{ color: '#555', marginBottom: '15px' }}>Help the author improve by leaving constructive feedback. You will earn 1 credit for your review!</p>

                <form onSubmit={handleFeedbackSubmit}>
                    <textarea
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Write your feedback here..."
                        rows="6"
                        required
                        style={{ width: '100%', padding: '10px', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '15px' }}
                    />

                    <button
                        type="submit"
                        disabled={isSubmitting || feedbackText.trim() === ""}
                        style={{
                            backgroundColor: isSubmitting ? '#999' : '#28a745',
                            color: 'white',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '1rem',
                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        {isSubmitting ? "Submitting..." : "Submit Feedback (+1 Credit)"}
                    </button>
                </form>

                {feedbackStatus === "success" && (
                    <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px' }}>
                        Success! Your feedback has been sent to the author and you earned 1 credit!
                    </div>
                )}
                {feedbackStatus !== "success" && feedbackStatus !== null && (
                    <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px' }}>
                        Error: {feedbackStatus}
                    </div>
                )}
            </div>
        </div>
    );
}