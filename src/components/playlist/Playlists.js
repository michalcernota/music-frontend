import {useState, useEffect} from "react";
import {useAuth} from "../auth/AuthContext";
import PlaylistForm from "./PlaylistForm";
import {Link} from "react-router-dom";

function Playlists() {
    const [data, setData] = useState([]);
    const [error, setError] = useState();
    const [isPending, setIsPending] = useState(true);
    const { token } = useAuth()

    useEffect(() => {
        fetch("http://localhost:8080/playlists")
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
        <div>
            {isPending && "Loading data..."}
            {error && <div>{error}</div>}

            <h2>Playlists</h2>
            {data.map(item => {
                return(
                    <div key={item.id}>
                        <Link to={`playlist-detail/${item.id}`}><h2>{item.name}</h2></Link>

                        <button onClick={() => {
                            fetch(`http://localhost:8080/playlists/delete/${item.id}`, {
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
                                .catch((err) => {setError(err.message)});
                        }}>Delete</button>
                    </div>
                )
            })}

            <PlaylistForm onNewPlaylist={onNewPlaylistHandler}/>
        </div>
    )
}

export default Playlists;