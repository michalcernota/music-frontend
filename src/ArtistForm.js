import {useState} from "react";

function ArtistForm(props) {
    const [name, setName] = useState("")
    const [nationality, setNationality] = useState("")
    const [file, setFile] = useState(null)

    const onSubmitHandler = event => {
        event.preventDefault()

        const newArtist = {
            name: name,
            nationality: nationality,
            image: null
        }

        const formData = new FormData();
        formData.append('file', file);
        console.log(formData);

        fetch("http://localhost:8080/artists/add", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newArtist)
        })
            .then(r => r.json())
            .then(json => {
                newArtist.id = json.id;
                console.log(json);
            })
            .finally(() => {
                props.onNewArtist(newArtist);
                setName("");
                setNationality("");
                setFile(null);
            });
    }

    const onFileChangeHandler = (e) => {
        setFile(e.target.files[0]);
        console.log(file);
    };

    return (
        <form onSubmit={onSubmitHandler}>
            <input placeholder={"Name"} type={"text"} value={name} onChange={(e) => {
                setName(e.target.value)
            }}/>
            <input placeholder={"Nationality"} type={"text"} value={nationality} onChange={(e) => {
                setNationality(e.target.value)
            }}/>
            <input type={"file"} onChange={onFileChangeHandler}/>
            <input type={"submit"}/>
        </form>
    )
}

export default ArtistForm;