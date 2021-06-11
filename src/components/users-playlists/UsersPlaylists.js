import {useAuth} from "../auth/AuthContext";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

function UsersPlaylists() {
    const [data, setData] = useState([]);
    const [error, setError] = useState();
    const [isPending, setIsPending] = useState(true);
    const { token } = useAuth()

    useEffect(() => {
        fetch("http://localhost:8080/user/playlists",
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
        <div>
            {isPending && "Loading data..."}
            {error && <div>{error}</div>}

            <h2>My Playlists</h2>
            {data.map(item => {
                return(
                    <div key={item.id}>
                        <Link to={`/player/${item.id}`}><h2>{item.playlistName}</h2></Link>

                        <button onClick={() => {
                            fetch(`http://localhost:8080/user/playlists/${item.id}`, {
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
                        }}>Remove</button>
                    </div>
                )
            })}
        </div>
    )
}

export default UsersPlaylists;