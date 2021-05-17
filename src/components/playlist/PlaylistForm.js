import {useState} from "react";
import {useAuth} from "../auth/AuthContext";

function PlaylistForm({onNewPlaylist}) {

    const [playlistName, setPlaylistName] = useState("");
    const [isError, setIsError] = useState(false);
    const {user, token} = useAuth();

    const onSubmitHandler = event => {
        event.preventDefault();

        if (!user) {
            setIsError("You are not logged in.");
            return;
        }

        const newPlaylist = {
            name: playlistName,
            ownerName: user.sub
        }

        console.log(token);
        console.log(newPlaylist);

        fetch("http://localhost:8080/playlists/add", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
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
                onNewPlaylist(json);
            })
            .catch((err) => {
                setIsError(err.message);
            })
            .finally(() => {
                setPlaylistName("");
            });
    }

    return (
        <>
            <form onSubmit={onSubmitHandler}>
                <input placeholder={'Playlist name'} type={'text'} onChange={
                    (e) => {
                        setPlaylistName(e.target.value)
                    }
                }/>
                <input type={'submit'}/>
            </form>

            {isError}
        </>
    )

}

export default PlaylistForm;