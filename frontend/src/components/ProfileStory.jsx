import React from "react";
import "./ProfileStory.css";

export default function ProfileStory({ image, title, description, onClick }) {
    return (
        <div className="profile-story" onClick={onClick}>

            <h2 className="profile-story-title">{title}</h2>
            <p className="profile-story-description">
                {description}
            </p>

        </div>
    );
}