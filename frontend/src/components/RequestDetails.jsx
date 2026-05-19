import { useParams } from 'react-router';
import './RequestDetails.css'

export default function RequestDetails({}) {
    let params = useParams();
    return (
    <div className="request-details">
        <h2>{params.id}</h2>
    </div>
    );
}