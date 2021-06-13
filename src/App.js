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
import 'bootstrap/dist/css/bootstrap.min.css';
import {Navbar, Nav} from "react-bootstrap";

function App() {

    const {user} = useAuth()

    const authenticatedRoutes = (
        <Router>
            <Navbar bg={"dark"} variant={"dark"}>
                <Navbar.Brand as={Link} to="/">Music Share</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to="/artists">Artists</Nav.Link>
                        <Nav.Link as={Link} to="/tracks">Tracks</Nav.Link>
                        <Nav.Link as={Link} to="/playlists">Playlists</Nav.Link>
                        <Nav.Link as={Link} to="/user/playlists">My playlists</Nav.Link>
                        <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                        <Nav.Link as={Link} to="/logout">Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            <Switch>
                <Route path="/logout">
                    <Logout/>
                </Route>
                <Route path='/profile'>
                    <Profile/>
                </Route>
                <Route path='/tracks'>
                    <Tracks/>
                </Route>
                <Route path='/artist-detail/:id' component={ArtistDetail}/>
                <Route path="/artists">
                    <Artists/>
                </Route>
                <Route exact path='/playlist-detail/:id' component={PlaylistDetail}/>
                <Route path='/user/playlists'>
                    <UsersPlaylists/>
                </Route>
                <Route exact path='/player/:id' component={MyPlaylistDetail}/>
                <Route path={['/', '/playlists']}>
                    <Playlists/>
                </Route>
            </Switch>
        </Router>
    )

    const nonAuthenticatedRoutes = (
        <Router>
            <Navbar bg={"dark"} variant={"dark"}>
                <Navbar.Brand as={Link} to="/">Music Share</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to="/artists">Artists</Nav.Link>
                        <Nav.Link as={Link} to="/tracks">Tracks</Nav.Link>
                        <Nav.Link as={Link} to="/playlists">Playlists</Nav.Link>
                        <Nav.Link as={Link} to="/login">Login</Nav.Link>
                        <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            <Switch>
                <Route path='/tracks'>
                    <Tracks/>
                </Route>
                <Route path='/login'>
                    <LoginForm/>
                </Route>
                <Route path='/signup'>
                    <SignUp/>
                </Route>
                <Route path='/artist-detail/:id' component={ArtistDetail}/>
                <Route path="/artists">
                    <Artists/>
                </Route>
                <Route path='/playlist-detail/:id' component={PlaylistDetail}/>
                <Route path={['/', '/playlists']}>
                    <Playlists/>
                </Route>
            </Switch>
        </Router>
    )

    return (<>{user ? authenticatedRoutes : nonAuthenticatedRoutes}</>)
}

export default App;
