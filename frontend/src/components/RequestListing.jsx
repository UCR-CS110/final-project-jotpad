import { useState } from 'react';
import { Link } from 'react-router-dom';
import "./RequestListing.css"

function BetaRequest({title, id, genre, tags, words, feedbackTypes, link }) {
    return (
        <tr class="beta-request">
            <td class="request-title">{title}</td>
            <td class="request-genre">{genre}</td>
            <td class="request-id">{id}</td>
            <td class="request-tags">{tags.map(tag => (<>{tag}, </>))}</td>
            <td class="request-words">{words} words</td>
            <td class="request-link"><Link to={link}>See page</Link></td>

        </tr>
    );
}

export default function RequestListing({}) {
    const [add, setAdd] = useState(false);

    let add_button; 
    if (add == true) {
        add_button = <button id="add-request-button">Add request</button>
    } else {
        add_button = <button id="add-request-button" disabled>Add request</button>
    }

    return (
        <div>
            <div class="requests-search">
                <input type="text" placeholder="Search requests by name" id="requests-search-input" />
                <button id="requests-search-button">Search</button>
            </div>

            <div class="add-request">
                {add_button}
            </div>
            

            <hr />

            <table class="beta-requests-table">
                <tr>
                    <th>Title</th>
                    <th>Genre</th>
                    <th>ID</th>
                    <th>Tags</th>
                    <th>Words</th>
                    <th>View</th>
                </tr>
                <BetaRequest title="WIP" id="001" genre="Science Fiction" tags={["Short story", "Aliens"]} words="3002" link={"/requests/"+"001"}/>
                
                <br />

                <BetaRequest title="wip2" id="002" genre="Fantasy" tags={["Serialized", "Fanfiction"]} words="60544" link={"/requests/"+"002"} />
            </table>

        </div>
    );

}