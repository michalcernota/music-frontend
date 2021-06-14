import {useState} from "react";
import {useAuth} from "../auth/AuthContext";
import {Alert, Button, Form, Row} from "react-bootstrap";

function PlaylistForm({onNewPlaylist}) {

    const [playlistName, setPlaylistName] = useState("");
    const [error, setError] = useState("");
    const {user, token} = useAuth();

    const onSubmitHandler = event => {
        event.preventDefault();

        if (!user) {
            setError("You are not logged in.");
            return;
        }

        const newPlaylist = {
            name: playlistName,
            ownerName: user.sub
        }

        fetch(`${process.env.REACT_APP_BASE_URI}/playlists`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(newPlaylist)
        })
            .then(r => {
                if (r.ok) {
                    return r.json();
                }
                throw new Error("Unable to get data: " + r.statusText);
            })
            .then(json => {
                newPlaylist.id = json.id;
                onNewPlaylist(newPlaylist);
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setPlaylistName("");
            });
    }

    return (
        <Row className={"mt-5 mb-5"}>
            <Form onSubmit={onSubmitHandler}>
                <Form.Control placeholder={'Playlist name'} type={'text'} value={playlistName} onChange={
                    (e) => {
                        setPlaylistName(e.target.value)
                    }
                }/>
                <Button className={"mt-2"} variant={"primary"} type={'submit'}>Save</Button>
            </Form>

            {error && <Alert className={"mt-2"} variant={"primary"}>{error.message}</Alert>}
        </Row>
    )
}

export default PlaylistForm;