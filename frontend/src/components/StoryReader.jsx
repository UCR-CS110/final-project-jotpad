import React, { useEffect, useState } from "react";

function StoryReader() {
  const [stories, setStories] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStories() {
      try {
        const res = await fetch("/api/stories/public");

        if (!res.ok) {
          throw new Error("Failed to fetch stories");
        }

        const data = await res.json();
        setStories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStories();
  }, []);

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading stories...</div>;
  }

  if (error) {
    return <div style={{ padding: "20px", color: "red" }}>{error}</div>;
  }

  if (!stories.length) {
    return <div style={{ padding: "20px" }}>No public stories found.</div>;
  }

  const story = stories[selectedIndex];

  return (
    <div style={{ padding: "20px", display: "flex", gap: "20px", height: "100vh" }}>


      <div style={{ width: "250px", borderRight: "1px solid #ddd", overflowY: "auto" }}>
        <h3>Stories</h3>

        {stories.map((s, i) => (
          <div
            key={s._id}
            onClick={() => setSelectedIndex(i)}
            style={{
              padding: "10px",
              cursor: "pointer",
              borderRadius: "6px",
              marginBottom: "5px",
              background: i === selectedIndex ? "#eee" : "transparent",
              fontWeight: i === selectedIndex ? "bold" : "normal"
            }}
          >
            {s.title}
          </div>
        ))}
      </div>


      <div style={{ flex: 2, padding: "0 20px", overflowY: "auto" }}>
        <h2>{story.title}</h2>

        <div style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>
          {story.tags?.length ? `Tags: ${story.tags.join(", ")}` : "No tags"}
        </div>

        <p style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>
          {story.content}
        </p>
      </div>


      <div style={{ flex: 1, borderLeft: "1px solid #ddd", paddingLeft: "20px" }}>
        <h3>Feedback</h3>

        <textarea
          rows="6"
          style={{ width: "100%", padding: "10px" }}
          placeholder="What did you think of the story?"
        />

        <button
          style={{
            marginTop: "10px",
            width: "100%",
            padding: "10px",
            cursor: "pointer"
          }}
        >
          Submit Review
        </button>
      </div>

    </div>
  );
}

export default StoryReader;