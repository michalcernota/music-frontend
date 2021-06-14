import {useState} from "react";
import {useAuth} from "../auth/AuthContext";
import {Alert, Button, Col, Container, Form, FormGroup, Row} from "react-bootstrap";

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

        fetch(`${process.env.REACT_APP_BASE_URI}/artists`, {
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
        <Container>
            <Row>
                <Col>
                    <Form onSubmit={onSubmitHandler}>
                        <FormGroup>
                            <Form.Control placeholder={"Name"} type={"text"} value={name} className={"mt-3"} onChange={(e) => {
                                setName(e.target.value)
                            }}/>
                            <Form.Control placeholder={"Nationality"} type={"text"} value={nationality} className={"mt-3"}
                                          onChange={(e) => {
                                              setNationality(e.target.value)
                                          }}/>
                            <Form.File type="file" accept={'image/png'} name="file" className={"mt-3"}
                                          onChange={(e) => setSelectedFile(e.target.files[0])}/>
                        </FormGroup>
                        <FormGroup>
                            <Button variant={"primary"} type={"submit"} className={"mt-3"}>Save</Button>
                        </FormGroup>
                    </Form>
                    {error && <Alert type={"danger"} className={"mt-3"}>{error}</Alert>}
                </Col>
            </Row>
        </Container>
    )
}

export default ArtistForm;