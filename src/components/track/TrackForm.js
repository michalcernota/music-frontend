import {useState} from "react";
import {useAuth} from "../auth/AuthContext";
import {Button, Form} from "react-bootstrap";

function TrackForm({artist, errorHandler, onNewTrackHandler}) {

    const [selectedFiles, setSelectedFiles] = useState();
    const {token} = useAuth();

    const onSubmitHandler = event => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('artistId', artist.id);
        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append('files', selectedFiles[i])
        }

        fetch(`${process.env.REACT_APP_BASE_URI}/tracks`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: formData
        })
            .then(r => {
                if (r.ok) {
                    return r.json();
                }
                throw new Error("Unable to post data: " + r.statusText);
            })
            .then(json => {
                onNewTrackHandler(json);
                errorHandler("");
            })
            .catch((err) => errorHandler(err.message));
    }

    return (
        <Form onSubmit={onSubmitHandler}>
            <Form.Group>
                <Form.Control type={"file"} accept={".mp3"} multiple
                              onChange={(e) => setSelectedFiles(e.target.files)}/>
            </Form.Group>
            <Button type={"submit"}>Save</Button>
        </Form>
    )
}

export default TrackForm;