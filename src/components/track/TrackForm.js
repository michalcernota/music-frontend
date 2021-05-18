import {useState} from "react";
import {useAuth} from "../auth/AuthContext";

function TrackForm({artist, errorHandler, onNewTrackHandler}) {

    const[trackName, setTrackName] = useState("");
    const[trackPath, setTrackPath] = useState("");
    const {token} = useAuth();

    const onSubmitHandler = event => {
        event.preventDefault()

        const newTrack = {
            name: trackName,
            trackPath: trackPath,
            artistId: artist.id
        }

        fetch("http://localhost:8080/tracks/add", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(newTrack)
        })
            .then(r => {
                if (r.ok) {
                    console.log(r.json);
                    return r.json();
                }
                throw new Error("Unable to post data: " + r.statusText);
            })
            .then(json => newTrack.id = json.id)
            .then(onNewTrackHandler(newTrack))
            .catch((err) => errorHandler(err.message))
            .finally(() => {
                setTrackName("");
                setTrackPath("");
            });
    }

    return (
        <form onSubmit={onSubmitHandler}>
            <input placeholder={"Name"} type={"text"} value={trackName} onChange={(e) => {
                setTrackName(e.target.value)
            }}/>
            <input placeholder={"Track Path"} type={"text"} value={trackPath} onChange={(e) => {
                setTrackPath(e.target.value)
            }}/>
            <input type={"submit"}/>
        </form>
    )
}

export default TrackForm;