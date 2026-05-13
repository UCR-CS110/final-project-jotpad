import React from 'react';

function StoryReader() {
  return (
    <div style={{ padding: '20px', display: 'flex', gap: '20px' }}>
      <div style={{ flex: 2 }}>
        <h2>The Martian City - Chapter 1</h2>
        <p>The red dust settled over the dome...</p>
        {/* Aquí iría el texto largo de la historia */}
      </div>
      
      <div style={{ flex: 1, borderLeft: '1px solid #ccc', paddingLeft: '20px' }}>
        <h3>Leave Constructive Feedback</h3>
        <textarea rows="5" style={{ width: '100%' }} placeholder="What did you think of the pacing?"></textarea>
        <br/><br/>
        <button>Submit Review & Earn Credit</button>
      </div>
    </div>
  );
}

export default StoryReader;