import {useAuth} from "../auth/AuthContext";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Alert, Button, Col, Container, Row} from "react-bootstrap";

function UsersPlaylists() {
    const [data, setData] = useState([]);
    const [error, setError] = useState();
    const [isPending, setIsPending] = useState(true);
    const {token} = useAuth()

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BASE_URI}/user/playlists`,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
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

    return (
        <Container>
            {isPending && "Loading data..."}
            {error && <Alert type={"danger"}>{error}</Alert>}

            <Row>
                <Col>
                    <h2>My Playlists</h2>
                </Col>
            </Row>
            {data.map(item => {
                return (
                    <Row key={item.id}>
                        <Col>
                            <Link to={`/player/${item.id}`}><h2>{item.playlistName}</h2></Link>
                        </Col>
                        <Col>
                            <Button onClick={() => {
                                fetch(`${process.env.REACT_APP_BASE_URI}/user/playlists/${item.id}`, {
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
                            }}>Remove</Button>
                        </Col>
                    </Row>
                )
            })}
        </Container>
    )
}

export default UsersPlaylists;