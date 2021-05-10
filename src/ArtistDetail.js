import {useState, useEffect} from "react";
import Artist from "./Artist";
import TrackDetail from "./TrackDetail";

function ArtistDetail({match}) {

    const [item, setItem] = useState();

    useEffect(() => {
        fetch(`http://localhost:8080/artist-detail/${match.params.id}`)
            .then(response => response.json())
            .then(json => {
                setItem(json);
            });
    }, [])

    return (<div>
        <h2>{item && item.artist.name}</h2>
        <h2>{item && item.artist.nationality}</h2>
        <h2>{item && item.artist.image}</h2>
        <img src={item && item.artist.image}/>

        <h2>Tracks</h2>
        {item && item.tracks.map(item => {
            return(
                <TrackDetail key={item.id} track={item}/>
            )
        })}
    </div>)
}

export default ArtistDetail;