import {useState, useEffect} from "react";
import {useAuth} from "../auth/AuthContext";
import {Alert, Button, Col, Container, Row} from "react-bootstrap";

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
        <Container className={"mt-3"}>
            {isPending && "Loading data..."}
            {error && <Alert type={"danger"}>{error}</Alert>}

            <Row>
                <h2>{playlist && playlist.name}</h2>
            </Row>
            <Row>
                <h4>Owner: {playlist && playlist.ownerName}</h4>
            </Row>
            <Row>
                <h4>{tracksCount} tracks</h4>
            </Row>

            <Row className={"mt-5"}>
                <h2>Tracks of playlist</h2>
            </Row>
            {tracks.map(item => {
                return (
                    <Row className={"mt-1"} key={item.id}>
                        <Col>
                            {item.trackName}
                        </Col>
                        {user && playlist.ownerName === user.sub &&
                        <Col>
                            <Button variant={"primary"} onClick={() => {

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

                            }}>Remove</Button>
                        </Col>
                        }
                    </Row>
                )
            })}

            {user && user.sub === playlist.ownerName &&
            <>
                <Row>
                    <h2>All tracks</h2>
                </Row>
                {allTracks.map(item => {
                    return (
                        <Row className={"mt-1"} key={item.id}>
                            <Col>
                                {item.name}
                            </Col>
                            {user && playlist.ownerName === user.sub &&
                            <Col>
                                <Button onClick={() => {
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

                                }}>Add</Button>
                            </Col>
                            }
                        </Row>
                    )
                })}
            </>}
        </Container>)
}

export default PlaylistDetail;