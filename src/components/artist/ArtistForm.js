import {useState} from "react";

function ArtistForm(props) {
    const [name, setName] = useState("")
    const [nationality, setNationality] = useState("")
    const [file, setFile] = useState("")

    const onSubmitHandler = event => {
        event.preventDefault()

        const newArtist = {
            name: name,
            nationality: nationality,
            image: file
        }

        fetch("http://localhost:8080/artists/add", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newArtist)
        })
            .then(r => {
                if (r.ok) {
                    return r.json();
                }
                throw new Error("Unable to get data: " + r.statusText);
            })
            .then(json => {
                newArtist.id = json.id;
                props.onNewArtist(newArtist);
            })
            .finally(() => {
                setName("");
                setNationality("");
                setFile("");
            });
    }

    return (
        <form onSubmit={onSubmitHandler}>
            <input placeholder={"Name"} type={"text"} value={name} onChange={(e) => {
                setName(e.target.value)
            }}/>
            <input placeholder={"Nationality"} type={"text"} value={nationality} onChange={(e) => {
                setNationality(e.target.value)
            }}/>
            <input placeholder={"Image"} type={"text"} value={file} onChange={(e) => {
                setFile(e.target.value);
            }}/>
            <input type={"submit"}/>
        </form>
    )
}

export default ArtistForm;