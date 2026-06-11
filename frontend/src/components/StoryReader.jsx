import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import StarRating from "./StarRating";

function StoryReader() {
  const [ratedStories, setRatedStories] = useState([]);
  const [unratedStories, setUnratedStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [typeTag, setTypeTag] = useState('');
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        let url = "/api/stories/public";
        if (filter != '') url = url + "?tag=" + filter;
        const publicRes = await fetch(url);

        if (!publicRes.ok) {
          throw new Error("Failed to fetch stories");
        }

        const publicData = await publicRes.json();

        setRatedStories(publicData.rated.slice(0, 5));
        setUnratedStories(publicData.unrated.slice(0, 5));

        if (publicData.rated.length > 0) {
          setSelectedStory(publicData.rated[0]);
        } else if (publicData.unrated.length > 0) {
          setSelectedStory(publicData.unrated[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [filter]);

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
    selectedStory.avgRating > 0
      ? "Top Rated"
      : "Unrated"

  const badgeColor =
    selectedStory.avgRating > 0
      ? "#28a745"
      : "#ff9800"
  //"#6c757d";

  /* const feedbackSection = 
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
      </div>*/
  return (
    <div>
      <h2 style={{ justifySelf: 'center', backgroundColor: '#89d1f0', borderRadius: '20px', padding: '10px 100px', border: '1px solid black' }}>Recommended For You</h2>
      <div style={{ justifySelf: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          id="filter-tags"
          style={{ fontSize: '15px', padding: '3px' }}
          placeholder="Type tag"
          value={typeTag}
          onChange={(e) => setTypeTag(e.target.value)}
        />
        <button style={{ fontSize: '15px', backgroundColor: '#bea977', padding: '5px' }} onClick={() => setFilter(typeTag)}>Search by tag</button>
      </div>

      <hr />
      <div style={{ padding: "20px", display: "flex", gap: "20px", minHeight: "100vh" }}>
        <div style={{ width: "300px", borderRight: "1px solid #ddd", overflowY: "auto" }}>
          <h3 style={{ fontSize: '25px' }}>Top Rated Stories</h3>
          {ratedStories.length === 0 && <p style={{ color: "#666", fontSize: '18px' }}>No rated stories available.</p>}
          {ratedStories.map((s) => (
            <div
              key={s._id}
              onClick={() => setSelectedStory(s)}
              style={{
                padding: "10px",
                cursor: "pointer",
                borderRadius: "6px",
                marginBottom: "5px",
                fontSize: '20px',
                background: selectedStory?._id === s._id ? "#eee" : "transparent",
                fontWeight: selectedStory?._id === s._id ? "bold" : "normal"
              }}
            >
              {s.title || "Untitled"}
              <br />
              {s.avgRating ? <>({Math.round(s.avgRating * 100) / 100} stars)</> : <></>}
            </div>
          ))}

          <h3 style={{ marginTop: "24px", fontSize: '25px' }}>New Stories</h3>
          {unratedStories.length === 0 && <p style={{ color: "#666", fontSize: '18px' }}>No unrated stories available.</p>}
          {unratedStories.map((s) => (
            <div
              key={s._id}
              onClick={() => setSelectedStory(s)}
              style={{
                padding: "10px",
                cursor: "pointer",
                borderRadius: "6px",
                marginBottom: "5px",
                fontSize: '20px',
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
            <h2 style={{ margin: 0, fontSize: '25px' }}>{selectedStory.title}</h2>
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

          <div style={{ fontSize: "18px", color: "#666", marginBottom: "10px" }}>
            {selectedStory.tags?.length ? `Tags: ${selectedStory.tags.join(", ")}` : "No tags"}
          </div>

          <StarRating rating={selectedStory.avgRating} />

          <p style={{ whiteSpace: "pre-line", lineHeight: "1.6", fontSize: '20px' }}>
            {selectedStory.content.slice(0, 100) + "..."}
          </p>
          <div style={{ justifySelf: 'center', paddingRight: '20%' }}><button style={{ fontSize: '20px', backgroundColor: '#c6bb88', borderRadius: '5px' }} onClick={() => navigate("/discover/story/" + selectedStory._id)}>View story</button></div>
        </div>

      </div>
    </div>
  );
}

export default StoryReader;