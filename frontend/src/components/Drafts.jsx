import { useState, useEffect } from 'react';
import './Drafts.css'

export default function Drafts({}) {
    const [drafts, setDrafts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchDrafts() {
          try {
            const res = await fetch("/api/stories/drafts");
    
            if (!res.ok) {
              throw new Error("Failed to fetch drafts");
            }
    
            const data = await res.json();
            setDrafts(data);
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


    return (
        <div>

        </div>
    )

}