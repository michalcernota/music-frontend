import {useState, useEffect} from "react";
import {useAuth} from "../auth/AuthContext";
import AudioPlayer from "../player/AudioPlayer";
import {Alert, Container} from "react-bootstrap";

function MyPlaylistDetail({match}) {
    const [error, setError] = useState("");
    const [isPending, setIsPending] = useState(true);
    const [tracks, setTracks] = useState([]);
    const { token } = useAuth();

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BASE_URI}/user/playlists/${match.params.id}`,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            .then(response => response.json())
            .then(json => {
                setTracks(json);
            })
            .catch((err) => setError(err.message))
            .finally(() => setIsPending(false));
    }, [])

    return (
        <Container>
            {isPending && "Loading data..."}
            {error && <Alert type={"danger"}>{error}</Alert>}

            {(!isPending && tracks.length > 0) && <AudioPlayer tracks={tracks}/>}
        </Container>
    )

}

export default MyPlaylistDetail;