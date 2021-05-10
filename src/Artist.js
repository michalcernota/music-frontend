import {Link} from 'react-router-dom';

function Artist({artist, onClickHandler}) {

    return (<div>
        <Link to={`artist-detail/${artist.id}`}><h2>{artist.name}</h2></Link>
        <div>{artist.nationality}</div>
        <img src={artist.file}/>
        <button onClick={() => {
            fetch(`http://localhost:8080/artists/${artist.id}`, {method: 'DELETE'})
                .then(r => r.json())
                .finally(() => {
                    onClickHandler(artist.id);
                });
        }}>Delete</button>
    </div>)

}

export default Artist;