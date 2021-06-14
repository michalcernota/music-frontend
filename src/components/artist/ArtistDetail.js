import {useState, useEffect} from "react";
import TrackForm from "../track/TrackForm";
import {Button, Card, Col, Container, Row} from "react-bootstrap";
import {useAuth} from "../auth/AuthContext";

function ArtistDetail({match}) {

    const [artist, setArtist] = useState();
    const [tracks, setTracks] = useState();
    const [error, setError] = useState();
    const [isPending, setIsPending] = useState(true);
    const [userRole, setUserRole] = useState();
    const {user, token} = useAuth()

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

        if (user) {
            fetch(`${process.env.REACT_APP_BASE_URI}/user/${user.sub}`, {
                method: 'GET',
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
                    setUserRole(json);
                })
                .catch((err) => setError(err.message));
        }
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

    const onDeleteTrackHandler = function (id) {
        const newData = [...tracks];
        const trackIndex = newData.findIndex(item => item.id === id);
        newData.splice(trackIndex, 1);
        setTracks(newData);
    }

    return (
        <Container fluid className={""}>
            {isPending && "Loading data..."}
            {error && <div>{error}</div>}

            <Row className={"mt-3"}>
                <Card className={"h-25 w-auto m-auto"}>
                    <Card.Img alt='Artist' src={artist && artist.pathToImage}/>
                    <Card.Body>
                        <h2>{artist && artist.name}</h2>
                    </Card.Body>
                </Card>
            </Row>

            <Container className={"mt-5"}>
                <Row>
                    <h2>Tracks</h2>
                </Row>


                {tracks && tracks.map(item => {
                    return (
                        <Row className={"mt-2"}>
                            <Col key={item.id}>{item.name}</Col>
                            <Col>
                            <Button onClick={() => {
                                fetch(`${process.env.REACT_APP_BASE_URI}/tracks/${item.id}`, {
                                    method: 'DELETE',
                                    headers: {
                                        'Authorization': 'Bearer ' + token
                                    }
                                })
                                    .then(r => r.json())
                                    .then(() => onDeleteTrackHandler(item.id))
                                    .catch((err) => setError(err.message));
                            }}>Delete
                            </Button>
                            </Col>
                        </Row>
                    )
                })}
            </Container>

            <Container className={"mt-5 mb-5"}>
                <Row>
                    {artist &&
                    <TrackForm artist={artist} errorHandler={errorHandler} onNewTrackHandler={onNewTracksHandler}/>}
                </Row>
            </Container>
        </Container>
    )
}

export default ArtistDetail;