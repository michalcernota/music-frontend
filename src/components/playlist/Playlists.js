import {useState, useEffect} from "react";
import {useAuth} from "../auth/AuthContext";
import PlaylistForm from "./PlaylistForm";
import {Link} from "react-router-dom";
import {Alert, Button, Col, Container, Row} from "react-bootstrap";

function Playlists() {
    const [data, setData] = useState([]);
    const [error, setError] = useState();
    const [isPending, setIsPending] = useState(true);
    const {user, token} = useAuth()

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BASE_URI}/playlists`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(`Unable get data: ${response.statusText}`);
            })
            .then(json => setData(json))
            .catch((error) => setError(error.message))
            .finally(() => setIsPending(false));
    }, [])

    const onDeletePlaylistHandler = function (id) {
        const newData = [...data];
        const playlistIndex = newData.findIndex(item => item.id === id);
        newData.splice(playlistIndex, 1);
        setData(newData);
    }

    const onNewPlaylistHandler = function (playlist) {
        const newData = [...data];
        newData.push(playlist);
        setData(newData);
    }

    return (
        <Container className={"mt-3"}>
            {isPending && "Loading data..."}
            {error && <Alert variant={"danger"}>{error}</Alert>}

            <Row>
                <h2>Playlists</h2>
            </Row>
            {data.map(item => {
                return (
                    <Row key={item.id}>
                        <Link to={`playlist-detail/${item.id}`}><h2>{item.name}</h2></Link>

                        {user && item && item.ownerName !== user.sub &&
                        <Col>
                            <Button variant={"primary"} onClick={() => {
                                fetch(`${process.env.REACT_APP_BASE_URI}/playlists/${item.id}`, {
                                    method: 'DELETE',
                                    headers: {
                                        'Authorization': 'Bearer ' + token
                                    }
                                })
                                    .then(r => {
                                        if (r.ok) {
                                            onDeletePlaylistHandler(item.id);
                                            return;
                                        }
                                        throw new Error("Unable to get data: " + r.statusText);
                                    })
                                    .catch((err) => {
                                        setError(err.message)
                                    });
                            }}>Delete</Button>
                        </Col>
                        }

                        {user && item && item.ownerName !== user.sub &&
                        <Col>
                            <Button variant={"primary"} onClick={() => {
                                fetch(`${process.env.REACT_APP_BASE_URI}/user/playlists/${item.id}`, {
                                    method: 'POST',
                                    headers: {
                                        'Authorization': 'Bearer ' + token
                                    }
                                })
                                    .then(r => {
                                        if (r.ok) {
                                            return;
                                        }
                                        throw new Error("Unable to get data: " + r.statusText);
                                    })
                                    .catch((err) => {
                                        setError(err.message)
                                    });
                            }}>Add to my playlists
                            </Button>
                        </Col>
                        }
                    </Row>
                )
            })}

            <Row>
                <Col>
                    <PlaylistForm onNewPlaylist={onNewPlaylistHandler}/>
                </Col>
            </Row>
        </Container>
    )
}

export default Playlists;