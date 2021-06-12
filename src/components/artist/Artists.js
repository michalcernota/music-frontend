import {useEffect, useState} from "react";
import Artist from "./Artist";
import ArtistForm from "./ArtistForm";
import {useAuth} from "../auth/AuthContext";

function Artists() {
    const [data, setData] = useState([])
    const [userRole, setUserRole] = useState()
    const [error, setError] = useState()
    const [isPending, setIsPending] = useState(true)
    const { user, token } = useAuth()

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

    return(
        <div>
            {isPending && "Loading data..."}
            {error && <div>{error}</div>}

            {data.map(item => {
                return(
                    <div key={item.id}>
                        <Artist key={item.id} artist={item} onClickHandler={onDeleteArtistHandler} userRole={userRole}/>
                    </div>
                )
            })}

            {userRole && userRole === 'ROLE_ADMIN' &&
                <ArtistForm onNewArtist={onNewArtistHandler}/>
            }
        </div>
    )
}

export default Artists;