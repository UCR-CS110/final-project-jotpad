import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function StoryView() {
    const { id } = useParams(); 
    
    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStory = async () => {
            try {
                // Ask the server for the story with this ID
                // (provisional URL, we will change it later)
                const response = await fetch(`http://localhost:5000/api/stories/${id}`);
                
                if (!response.ok) {
                    throw new Error("No pudimos encontrar esta historia.");
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

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}> Loading story... </div>;
    
    if (error) return <div style={{ textAlign: 'center', color: 'red', marginTop: '50px' }}>Error: {error}</div>;
    
    if (!story) return <div>Story not found.</div>;

    return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', backgroundColor: '#fdfbf7', minHeight: '100vh' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{story.title}</h1>
            <p style={{ color: 'gray', fontStyle: 'italic' }}>Palabras: {story.wordCount || "Desconocido"}</p>
            <hr style={{ margin: '20px 0' }} />
            
            <div style={{ whiteSpace: 'pre-wrap', fontSize: '1.2rem', lineHeight: '1.8' }}>
                {story.content}
            </div>
        </div>
    );
}