import { Link } from 'react-router-dom';
import "./RequestListing.css"

function BetaRequest({title, id, genre, tags, words, feedbackTypes }) {
    return (
        <div class="beta-request">
            <h2>{title}</h2>
            <p>{genre}</p>
            <p>{id}</p>
            <p>{tags.map(tag => (<>{tag}, </>))}</p>
            <p>{words} words</p>

        </div>
    );
}

export default function RequestListing({}) {
    

    return (
        <div>
            <input type="text" id="beta-request-search" placeholder="Search requests by name" />
            <button>Search</button>

            <hr />

            <div class="beta-requests-table">
                
                <Link to={"/requests/"+"001"}><BetaRequest title="WIP" id="001" genre="Science Fiction" tags={["Short story", "Aliens"]} words="3002" /></Link>
                
                <br />

                <Link to={"/requests/"+"002"}><BetaRequest title="wip2" id="002" genre="Fantasy" tags={["Serialized", "Fanfiction"]} words="60544" /></Link>
            </div>
            

        </div>
    );

}