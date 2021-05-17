import {useEffect, useState} from "react";
import Artist from "./Artist";
import ArtistForm from "./ArtistForm";

function Artists() {
    const [data, setData] = useState([])
    const [error, setError] = useState()
    const [isPending, setIsPending] = useState(true)

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
        fetch("http://localhost:8080/artists")
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new Error(`Unable get data: ${response.statusText}`)
            })
            .then(json => setData(json))
            .catch((err) => setError(err.message))
            .finally(() => setIsPending(false));
    }, [])

    return(
        <div>
            {isPending && "Loading data..."}
            {error && <div>{error}</div>}

            {data.map(item => {
                return(
                    <Artist key={item.id} artist={item} onClickHandler={onDeleteArtistHandler}/>
                )
            })}

            <ArtistForm onNewArtist={onNewArtistHandler}/>
        </div>
    )
}

export default Artists;