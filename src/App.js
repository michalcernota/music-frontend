import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import ArtistDetail from "./components/artist/ArtistDetail";
import Tracks from "./components/track/Tracks";
import Playlists from "./components/playlist/Playlists";
import LoginForm from "./components/auth/LoginForm";
import {useAuth} from "./components/auth/AuthContext";
import SignUp from "./components/auth/Signup";
import Artists from "./components/artist/Artists";
import PlaylistDetail from "./components/playlist/PlaylistDetail";
import Profile from "./components/auth/Profile";
import Logout from "./components/auth/Logout";
import UsersPlaylists from "./components/users-playlists/UsersPlaylists";
import MyPlaylistDetail from "./components/users-playlists/MyPlaylistDetail";

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
                        <li>
                            <Link to="/user/playlists">My Playlists</Link>
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
                <Route exact path='/playlist-detail/:id' component={PlaylistDetail} />
                <Route path='/user/playlists'>
                    <UsersPlaylists />
                </Route>
                <Route exact path='/player/:id' component={MyPlaylistDetail}/>
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

export default App;
