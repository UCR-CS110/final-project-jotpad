import banner from '../assets/banner.jpg';
import pfp from '../assets/pfp.webp';
import './Profile.css'

function ProfileStory({ image, title, description }) {
    return (
        <div class="profile-story">
            <img src={image} alt="story-cover1" class="profile-story-cover" />
            <div class="profile-story-info">
                <h2 class="profile-story-title">{title}</h2>
                <p class="profile-story-description">{description}</p>
            </div>
        </div>
    );
}

export default function Profile() {

    return (
        <div class="profile">
            <img src={banner} alt="Banner" id="profile-banner" />
            <img src={pfp} alt="Profile Pic" id="profile-pic"/>
            <div class="profile-top">
                <h2 id="profile-username">TenaciousAlpaca</h2>
                <h3 id="profile-description">Moo. (?)</h3>
                <h3 id="profile-works-created"><strong>Works created:</strong> 3</h3>
            </div>


            <hr></hr>

            <div class="profile-stories">
                <h2 id="profile-my-stories">My stories</h2>

                <ProfileStory
                    image={"https://static.vecteezy.com/system/resources/thumbnails/002/219/582/small/illustration-of-book-icon-free-vector.jpg"}
                    title="Title 1"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                />

                <ProfileStory
                    image={"https://static.vecteezy.com/system/resources/thumbnails/002/219/582/small/illustration-of-book-icon-free-vector.jpg"}
                    title="Title 2"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                />

                <ProfileStory
                    image={"https://static.vecteezy.com/system/resources/thumbnails/002/219/582/small/illustration-of-book-icon-free-vector.jpg"}
                    title="Title 3"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                />
                
            </div>


        </div>
    );

}