import React, { useEffect, useState } from "react";

function StoryReader() {
  const [publicStories, setPublicStories] = useState([]);
  const [inReviewStories, setInReviewStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const [publicRes, inReviewRes] = await Promise.all([
          fetch("/api/stories/public"),
          fetch("/api/stories/in_review")
        ]);

        if (!publicRes.ok || !inReviewRes.ok) {
          throw new Error("Failed to fetch stories");
        }

        const [publicData, inReviewData] = await Promise.all([
          publicRes.json(),
          inReviewRes.json()
        ]);

        setPublicStories(publicData);
        setInReviewStories(inReviewData);

        if (publicData.length > 0) {
          setSelectedStory(publicData[0]);
        } else if (inReviewData.length > 0) {
          setSelectedStory(inReviewData[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading stories...</div>;
  }

  if (error) {
    return <div style={{ padding: "20px", color: "red" }}>{error}</div>;
  }

  if (!selectedStory) {
    return <div style={{ padding: "20px" }}>No stories found.</div>;
  }

  const statusLabel =
    selectedStory.status === "in_review"
      ? "In Review"
      : selectedStory.status === "public"
        ? "Public"
        : "Draft";

  const badgeColor =
    selectedStory.status === "public"
      ? "#28a745"
      : selectedStory.status === "in_review"
        ? "#ff9800"
        : "#6c757d";

  return (
    <div style={{ padding: "20px", display: "flex", gap: "20px", minHeight: "100vh" }}>
      <div style={{ width: "300px", borderRight: "1px solid #ddd", overflowY: "auto" }}>
        <h3>Public Stories</h3>
        {publicStories.length === 0 && <p style={{ color: "#666" }}>No public stories available.</p>}
        {publicStories.map((s) => (
          <div
            key={s._id}
            onClick={() => setSelectedStory(s)}
            style={{
              padding: "10px",
              cursor: "pointer",
              borderRadius: "6px",
              marginBottom: "5px",
              background: selectedStory?._id === s._id ? "#eee" : "transparent",
              fontWeight: selectedStory?._id === s._id ? "bold" : "normal"
            }}
          >
            {s.title || "Untitled"}
          </div>
        ))}

        <h3 style={{ marginTop: "24px" }}>In Review Stories</h3>
        {inReviewStories.length === 0 && <p style={{ color: "#666" }}>No in-review stories available.</p>}
        {inReviewStories.map((s) => (
          <div
            key={s._id}
            onClick={() => setSelectedStory(s)}
            style={{
              padding: "10px",
              cursor: "pointer",
              borderRadius: "6px",
              marginBottom: "5px",
              background: selectedStory?._id === s._id ? "#eee" : "transparent",
              fontWeight: selectedStory?._id === s._id ? "bold" : "normal"
            }}
          >
            {s.title || "Untitled"}
          </div>
        ))}
      </div>

      <div style={{ flex: 2, padding: "0 20px", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
          <h2 style={{ margin: 0 }}>{selectedStory.title}</h2>
          <span
            style={{
              padding: "6px 12px",
              borderRadius: "999px",
              backgroundColor: badgeColor,
              color: "#fff",
              fontSize: "0.9rem"
            }}
          >
            {statusLabel}
          </span>
        </div>

        <div style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>
          {selectedStory.tags?.length ? `Tags: ${selectedStory.tags.join(", ")}` : "No tags"}
        </div>

        <p style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>
          {selectedStory.content}
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