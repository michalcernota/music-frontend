import {useState, useEffect} from "react";
import {useAuth} from "../auth/AuthContext";
import AudioPlayer from "../player/AudioPlayer";

function MyPlaylistDetail({match}) {
    const [error, setError] = useState("");
    const [isPending, setIsPending] = useState(true);
    const [tracks, setTracks] = useState([]);
    const { token } = useAuth();

    useEffect(() => {
        fetch(`http://localhost:8080/usersPlaylists/${match.params.id}/tracks`,
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
        <div>
            {isPending && "Loading data..."}
            {error && <div>{error}</div>}

            {!isPending && <AudioPlayer tracks={tracks}/>}
        </div>
    )

}

export default MyPlaylistDetail;