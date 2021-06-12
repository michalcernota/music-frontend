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
        fetch(`${process.env.REACT_APP_BASE_URI}/playlists/${match.params.id}`)
            .then(response => response.json())
            .then(json => {
                const playlist = {
                    id: json.id,
                    name: json.name,
                    ownerName: json.ownerName
                }

                setPlaylist(playlist);
                setTracksCount(json.tracksCount);
                setTracks(json.tracksOfPlaylist);
            })
            .catch((err) => setError(err.message));

        fetch(`${process.env.REACT_APP_BASE_URI}/tracks`)
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
                return (
                    <div key={item.id}>
                        {item.trackName}
                        {user && playlist.ownerName === user.sub &&
                        <button onClick={() => {

                            fetch(`${process.env.REACT_APP_BASE_URI}/playlists/tracks/${item.id}`, {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': 'Bearer ' + token
                                }
                            })
                                .then(r => {
                                    if (r.ok) {
                                        return r.json();
                                    }
                                    throw new Error("Unable to get data: " + r.statusText);
                                })
                                .then(json => {
                                    console.log(json);
                                    onRemoveTrackFromPlaylist(json);
                                    setError("");
                                })
                                .catch((err) => {
                                    setError(err.message)
                                });

                        }}>Remove</button>
                        }
                    </div>
                )
            })}

            {user && user.sub === playlist.ownerName &&
            <div>
                <h2>All tracks</h2>
                {allTracks.map(item => {
                    return (
                        <div key={item.id}>
                            {item.name}
                            {user && playlist.ownerName === user.sub &&
                            <button onClick={() => {
                                const trackOfPlaylist = {
                                    trackId: item.id,
                                    playlistId: playlist.id,
                                    trackName: item.name
                                }

                                fetch(`${process.env.REACT_APP_BASE_URI}/playlists/tracks`, {
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
                                    .catch((err) => {
                                        setError(err.message)
                                    });

                            }}>Add</button>
                            }
                        </div>
                    )
                })}
            </div>}
        </div>)
}

export default PlaylistDetail;