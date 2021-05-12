import './App.css';
import {useState, useEffect} from "react";
import Artist from "./Artist";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import ArtistForm from "./ArtistForm";
import ArtistDetail from "./ArtistDetail";
import Tracks from "./Tracks";

function App() {
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

    return (
        <Router>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Artists</Link>
                    </li>
                    <li>
                        <Link to="/tracks">Tracks</Link>
                    </li>
                    <li>
                        <Link to="/playlists">Playlists</Link>
                    </li>
                </ul>
            </nav>

            <Switch>
                <Route path='/tracks'>
                    <Tracks />
                </Route>
                <Route path='/playlists'>

                </Route>
                <Route path='/artist-detail/:id' component={ArtistDetail} />
                <Route path="/">
                    <div className="App">
                        {isPending && "Loading data..."}
                        {error && <div>{error}</div>}

                        {data.map(item => {
                            return(
                                <Artist key={item.id} artist={item} onClickHandler={onDeleteArtistHandler}/>
                            )
                        })}

                        <ArtistForm onNewArtist={onNewArtistHandler}/>
                    </div>
                </Route>
            </Switch>

        </Router>
    );
}

export default App;
