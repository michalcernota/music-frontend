import {useState} from "react";
import {useAuth} from "../auth/AuthContext";

function ArtistForm({onNewArtist}) {
    const [name, setName] = useState("")
    const [nationality, setNationality] = useState("")
    const [selectedFile, setSelectedFile] = useState();
    const [error, setError] = useState()
    const {token} = useAuth();

    const onSubmitHandler = event => {
        event.preventDefault()

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('name', name);
        formData.append('nationality', nationality);

        fetch("http://localhost:8080/artists/add", {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: formData
        })
            .then(r => {
                if (r.ok) {
                    return r.json();
                }
                throw new Error("Unable to get data: " + r.statusText);
            })
            .then(json => {
                const newArtist = {
                    id: json.id,
                    name: json.name,
                    nationality: json.nationality,
                    pathToImage: json.pathToImage
                }

                onNewArtist(newArtist);

            })
            .catch((err) => setError(err.message))
            .finally(() => {
                setName("");
                setNationality("");
                setSelectedFile(null);
            });
    }

    return (
        <div>
            {error && <div>{error}</div>}

            <form onSubmit={onSubmitHandler}>
                <input placeholder={"Name"} type={"text"} value={name} onChange={(e) => {
                    setName(e.target.value)
                }}/>
                <input placeholder={"Nationality"} type={"text"} value={nationality} onChange={(e) => {
                    setNationality(e.target.value)
                }}/>
                <input type="file" name="file" onChange={(e) => setSelectedFile(e.target.files[0])}/>
                <input type={"submit"}/>
            </form>
        </div>
    )
}

export default ArtistForm;