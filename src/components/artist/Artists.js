import {useEffect, useState} from "react";
import Artist from "./Artist";
import ArtistForm from "./ArtistForm";
import {useAuth} from "../auth/AuthContext";
import {Alert, CardGroup, Container, Row} from "react-bootstrap";

function Artists() {
    const [data, setData] = useState([])
    const [userRole, setUserRole] = useState()
    const [error, setError] = useState()
    const [isPending, setIsPending] = useState(true)
    const {user, token} = useAuth()

    const onNewArtistHandler = function (artist) {
        const newData = [...data];
        newData.push(artist);
        setData(newData);
    }

    const onDeleteArtistHandler = function (id) {
        const newData = [...data];
        const artistIndex = newData.findIndex(item => item.id === id);
        newData.splice(artistIndex, 1);
        setData(newData);
    }

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BASE_URI}/artists`)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new Error(`Unable get data: ${response.statusText}`)
            })
            .then(json => setData(json))
            .catch((err) => setError(err.message));

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

        setIsPending(false);

    }, [])

    return (
        <Container>
            <Row className={"mt-3"}>
                <h2>Artists</h2>
            </Row>

            <Row className={"mt-2"}>
                {isPending && <Alert variant={"info"}>"Loading data..."</Alert>}
            </Row>

            <Row>
                <CardGroup className="flex-lg-row">
                {data.map(item => {
                    return (
                        <Artist key={item.id} artist={item} onClickHandler={onDeleteArtistHandler} userRole={userRole}/>
                    )
                })}
                </CardGroup>
            </Row>

            <Row>
                {userRole && userRole === 'ROLE_ADMIN' &&
                <ArtistForm onNewArtist={onNewArtistHandler}/>
                }
            </Row>

            {error && <Alert variant={"danger"}>{error}</Alert>}
        </Container>
    )
}

export default Artists;