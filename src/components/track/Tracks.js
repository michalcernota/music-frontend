import {useState, useEffect} from "react";

function Tracks() {

    const [data, setData] = useState([]);
    const [error, setError] = useState();
    const [isPending, setIsPending] = useState(true);

    useEffect(() => {
        fetch("http://localhost:8080/tracks")
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

    const onDeleteTrackHandler = function (id) {
        const newData = [...data];
        const trackIndex = newData.findIndex(item => item.id === id);
        newData.splice(trackIndex, 1);
        setData(newData);
    }

    return(
        <div>
            <h2>Tracks</h2>

            {isPending && "Loading data..."}
            {error && <div>{error}</div>}

            {data.map(item => {
                return(
                    <div key={item.id}>
                        <h2>{item.name}</h2>
                        <button onClick={() => {
                            fetch(`http://localhost:8080/tracks/remove/${item.id}`, {method: 'DELETE'})
                                .then(r => r.json())
                                .then(() => onDeleteTrackHandler(item.id))
                                .catch((err) => setError(err.message));
                        }}>Delete</button>
                    </div>
                )
            })}
        </div>
    )

}

export default Tracks;