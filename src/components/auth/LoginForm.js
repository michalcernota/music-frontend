import {Redirect} from "react-router-dom";
import {useAuth} from "./AuthContext";
import React, {useState} from 'react';
import {Form, Button, Container, Row, Alert, Col} from 'react-bootstrap';

function LoginForm() {

    const [isLoggedIn, setLoggedIn] = useState(false);
    const [isError, setIsError] = useState(false);
    const [data, setData] = useState({});
    const {setTokens} = useAuth();

    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        data[name] = value;
        setData({...data})
    }

    function postLogin(e) {
        e.preventDefault()

        fetch(`${process.env.REACT_APP_BASE_URI}/authenticate`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new Error(`Unable to get data: ${response.statusText}`)
            })
            .then(json => {
                setTokens(json.token);
                setLoggedIn(true);
            })
            .catch((err) => {
                setIsError(err.message)
            })
    }

    if (isLoggedIn) {
        return <Redirect to="/"/>;
    }

    return (
        <Container>
            <Row className={"mt-2"}>
                <Col>
                    <h2>Login</h2>
                </Col>
            </Row>
            <Row className={"mt-3"}>
                <Col>
                    <Form onSubmit={postLogin}>
                        <Form.Group controlId="formUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control name={"username"} type={"text"} placeholder={"Enter username"}
                                          onChange={handleInputChange}/>
                        </Form.Group>
                        <Form.Group controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control name={"password"} type={"password"} placeholder="Password"
                                          onChange={handleInputChange}/>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
            <Row className={"mt-5"}>
                <Alert type={"danger"}>
                    {isError}
                </Alert>
            </Row>
        </Container>
    )
}

export default LoginForm;