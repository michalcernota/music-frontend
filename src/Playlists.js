import {useState, useEffect} from "react";

function Playlists() {
    const[data, setData] = useState([]);
    const [error, setError] = useState();
    const [isPending, setIsPending] = useState(true);

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

    return (
        <div>
            {isPending && "Loading data..."}
            {error && <div>{error}</div>}

            <h2>Playlists</h2>
            {data.map(item => {
                return(
                    <div key={item.id}>
                        <h2>{item.name}</h2>
                    </div>
                )
            })}
        </div>
    )
}

export default Playlists;