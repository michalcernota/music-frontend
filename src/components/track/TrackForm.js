import {useState} from "react";
import {useAuth} from "../auth/AuthContext";

function TrackForm({artist, errorHandler, onNewTrackHandler}) {

    const [selectedFiles, setSelectedFiles] = useState();
    const {token} = useAuth();

    const onSubmitHandler = event => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('artistId', artist.id);
        for(let i = 0; i< selectedFiles.length; i++) {
            formData.append('files', selectedFiles[i])
        }

        fetch("http://localhost:8080/tracks/add", {
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
        <form onSubmit={onSubmitHandler}>
            <input type={"file"} multiple onChange={(e) => setSelectedFiles(e.target.files)}/>
            <input type={"submit"}/>
        </form>
    )
}

export default TrackForm;