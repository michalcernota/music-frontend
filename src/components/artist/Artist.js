import {Link} from 'react-router-dom';
import {useAuth} from "../auth/AuthContext";

function Artist({artist, onClickHandler, userRole}) {
    const {token} = useAuth();

    return (
        <div>
            <Link to={`artist-detail/${artist.id}`}><h2>{artist.name}</h2></Link>
            <div>{artist.nationality}</div>
            <img alt='Artist' src={artist.pathToImage}/>

            {userRole && userRole === 'ROLE_ADMIN' &&
            <button onClick={() => {
                fetch(`${process.env.REACT_APP_BASE_URI}/artists/${artist.id}`,
                    {
                        method: 'DELETE',
                        headers: {
                            'Authorization': 'Bearer ' + token
                        }
                    })
                    .then(r => r.json())
                    .finally(() => {
                        onClickHandler(artist.id);
                    });
            }}>Delete
            </button>
            }
        </div>)

}

export default Artist;