import {useState, useEffect} from "react";
import TrackDetail from "../track/TrackDetail";
import TrackForm from "../track/TrackForm";

function ArtistDetail({match}) {

    const [artist, setArtist] = useState();
    const [tracks, setTracks] = useState();
    const [error, setError] = useState();
    const [isPending, setIsPending] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:8080/artists/detail/${match.params.id}`)
            .then(response => response.json())
            .then(json => {
                setArtist(json.artist);
                setTracks(json.tracks);
            })
            .catch((err) => setError(err.message))
            .finally(() => setIsPending(false));
    }, [])

    const errorHandler = function (error) {
        setError(error);
    }

    const onNewTracksHandler = function (addedTracks) {
        const newTracks = [...tracks];
        addedTracks.map(addedTrack => {
            newTracks.push(addedTrack);
        })
        setTracks(newTracks);
    }

    return (
        <div>
            {isPending && "Loading data..."}
            {error && <div>{error}</div>}

            <h2>{artist && artist.name}</h2>
            <h2>{artist && artist.nationality}</h2>
            <img alt='Artist' src={artist && artist.pathToImage}/>

            <h2>Tracks</h2>
            {tracks && tracks.map(item => {
                return (
                    <TrackDetail key={item.id} track={item}/>
                )
            })}

            {artist && <TrackForm artist={artist} errorHandler={errorHandler} onNewTrackHandler={onNewTracksHandler}/>}
        </div>)
}

export default ArtistDetail;