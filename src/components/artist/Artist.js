import {Link} from 'react-router-dom';
import {useAuth} from "../auth/AuthContext";
import {Button, Card} from "react-bootstrap";

function Artist({artist, onClickHandler, userRole}) {
    const {token} = useAuth();

    return (
        <Card className="m-5 border-0 shadow">
            <Link to={`artist-detail/${artist.id}`}>
                <Card.Img className={"card-img-top"} variant={"top"} alt='Artist' src={artist.pathToImage}/>
                <Card.Body>
                    <h2>{artist.name}</h2>
                </Card.Body>
            </Link>

            <Card.Footer>
                {userRole && userRole === 'ROLE_ADMIN' &&
                <Button variant={"primary"} onClick={() => {
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
                </Button>
                }
            </Card.Footer>
        </Card>)

}

export default Artist;