import {useState, useEffect} from "react";
import TrackForm from "../track/TrackForm";

function ArtistDetail({match}) {

    const [artist, setArtist] = useState();
    const [tracks, setTracks] = useState();
    const [error, setError] = useState();
    const [isPending, setIsPending] = useState(true);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BASE_URI}/artists/${match.params.id}`)
            .then(response => response.json())
            .then(json => {
                const artist = {
                    id: json.id,
                    name: json.name,
                    nationality: json.nationality,
                    pathToImage: json.pathToImage
                }

                setArtist(artist);
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
                    <div key={item.id}>{item.name}</div>
                )
            })}

            {artist && <TrackForm artist={artist} errorHandler={errorHandler} onNewTrackHandler={onNewTracksHandler}/>}
        </div>)
}

export default ArtistDetail;