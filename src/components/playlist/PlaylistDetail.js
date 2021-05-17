import {useState, useEffect} from "react";
import {useAuth} from "../auth/AuthContext";

function PlaylistDetail({match}) {

    const [error, setError] = useState("");
    const [isPending, setIsPending] = useState(true);
    const [tracksCount, setTracksCount] = useState(0);
    const [playlist, setPlaylist] = useState({});
    const [tracks, setTracks] = useState([]);
    const [allTracks, setAllTracks] = useState([]);
    const {user, token} = useAuth();

    useEffect(() => {
        fetch(`http://localhost:8080/playlists/${match.params.id}`)
            .then(response => response.json())
            .then(json => {
                setPlaylist(json.playlist);
                setTracksCount(json.tracksCount);
                setTracks(json.tracksOfPlaylist);
            })
            .catch((err) => setError(err.message));

        fetch("http://localhost:8080/tracks")
            .then(response => response.json())
            .then(json => {
                setAllTracks(json);
            })
            .catch((err) => setError(err.message))
            .finally(() => setIsPending(false));
    }, [])

    const onAddTrackToPlaylist = function (trackOfPlaylist) {
        const newTracks = [...tracks];
        newTracks.push(trackOfPlaylist);
        setTracks(newTracks);
        setTracksCount(newTracks.length);
    }

    const onRemoveTrackFromPlaylist = function (trackOfPlaylist) {
        const newTracks = [...tracks];
        const artistIndex = newTracks.findIndex(item => item.id === trackOfPlaylist.id);
        newTracks.splice(artistIndex, 1);
        setTracks(newTracks);
        setTracksCount(newTracks.length);
    }

    return (
        <div>
            {isPending && "Loading data..."}
            {error && <div>{error}</div>}

            <div>
                <h2>{playlist && playlist.name}</h2>
                <h2>Owner: {playlist && playlist.ownerName}</h2>
                <h2>{tracksCount} tracks</h2>
            </div>

            <h2>Tracks of playlist</h2>
            {tracks.map(item => {
                return(
                    <div key={item.id}>
                        {item.trackName}
                        <button onClick={() => {
                            const trackOfPlaylist = {
                                id: item.id
                            }

                            fetch("http://localhost:8080/playlists/deleteTrack", {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + token
                                },
                                body: JSON.stringify(trackOfPlaylist)
                            })
                                .then(r => {
                                    if (r.ok) {
                                        return r.json();
                                    }
                                    throw new Error("Unable to get data: " + r.statusText);
                                })
                                .then(json => {
                                    trackOfPlaylist.id = json.id;
                                    onRemoveTrackFromPlaylist(trackOfPlaylist);
                                    setError("");
                                })
                                .catch((err) => {setError(err.message)});

                        }}>Remove</button>
                    </div>
                )
            })}

            <h2>All tracks</h2>
            {allTracks.map(item => {
                return(
                    <div key={item.id}>
                        {item.name}
                        <button onClick={() => {
                            const trackOfPlaylist = {
                                trackId: item.id,
                                playlistId: playlist.id,
                                trackName: item.name
                            }

                            fetch("http://localhost:8080/playlists/addTrack", {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + token
                                },
                                body: JSON.stringify(trackOfPlaylist)
                            })
                                .then(r => {
                                    if (r.ok) {
                                        return r.json();
                                    }
                                    throw new Error("Unable to get data: " + r.statusText);
                                })
                                .then(json => {
                                    trackOfPlaylist.id = json.id;
                                    onAddTrackToPlaylist(trackOfPlaylist);
                                    setError("");
                                })
                                .catch((err) => {setError(err.message)});

                        }}>Add</button>
                    </div>
                )
            })}
        </div>)
}

export default PlaylistDetail;