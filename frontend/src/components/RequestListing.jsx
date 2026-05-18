import "./RequestListing.css"

function BetaRequest({title, genre, tags, words, feedbackTypes }) {
    return (
        <div class="beta-request">
            <h2>{title}</h2>
            <p>{genre}</p>
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
                <BetaRequest title="WIP" genre="Science Fiction" tags={["Short story", "Aliens"]} words="3002" />

                <br />

                <BetaRequest title="wip2" genre="Fantasy" tags={["Serialized", "Fanfiction"]} words="60544" />
            </div>
            

        </div>
    );

}