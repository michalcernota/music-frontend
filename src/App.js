import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link, Redirect
} from "react-router-dom";
import ArtistDetail from "./ArtistDetail";
import Tracks from "./Tracks";
import Playlists from "./Playlists";
import LoginForm from "./LoginForm";
import {useAuth} from "./AuthContext";
import SignUp from "./Signup";
import Artists from "./Artists";
import PlaylistDetail from "./PlaylistDetail";

function App() {

    const { user } = useAuth()

    const authenticatedRoutes = (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/artists">Artists</Link>
                        </li>
                        <li>
                            <Link to="/tracks">Tracks</Link>
                        </li>
                        <li>
                            <Link to="/playlists">Playlists</Link>
                        </li>
                        <li>
                            <Link to='/logout'>Logout</Link>
                        </li>
                        <li>
                            <Link to="/profile">Profile</Link>
                        </li>
                    </ul>
                </nav>
            </div>

            <Switch>
                <Route path="/logout">
                    <Logout />
                </Route>
                <Route path='/profile'>
                    <Profile />
                </Route>
                <Route path='/tracks'>
                    <Tracks />
                </Route>
                <Route path='/artist-detail/:id' component={ArtistDetail} />
                <Route path="/artists">
                    <Artists />
                </Route>
                <Route path='/playlist-detail/:id' component={PlaylistDetail} />
                <Route path={['/', '/playlists']}>
                    <Playlists />
                </Route>
            </Switch>
        </Router>
    )

    const nonAuthenticatedRoutes = (
        <Router>
            <nav>
                <ul>
                    <li>
                        <Link to="/artists">Artists</Link>
                    </li>
                    <li>
                        <Link to="/tracks">Tracks</Link>
                    </li>
                    <li>
                        <Link to="/playlists">Playlists</Link>
                    </li>
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                    <li>
                        <Link to="/signup">Sign Up</Link>
                    </li>
                </ul>
            </nav>

            <Switch>
                <Route path='/tracks'>
                    <Tracks />
                </Route>
                <Route path='/login'>
                    <LoginForm />
                </Route>
                <Route path='/signup'>
                    <SignUp />
                </Route>
                <Route path='/artist-detail/:id' component={ArtistDetail} />
                <Route path="/artists">
                    <Artists />
                </Route>
                <Route path='/playlist-detail/:id' component={PlaylistDetail} />
                <Route path={['/', '/playlists']}>
                    <Playlists />
                </Route>
            </Switch>
        </Router>
    )

    return (<>{user ? authenticatedRoutes : nonAuthenticatedRoutes}</>)
}

function Logout() {
    const { removeTokens } = useAuth()
    removeTokens()
    return <Redirect to="/"/>;
}

function Profile() {
    const { user, token } = useAuth()
    return <>
        <h2>Profile</h2>
        <div>
            <strong>User</strong> {JSON.stringify(user)}
        </div>
        <div>
            <strong>Token</strong> {token}
        </div>
    </>;
}

export default App;
