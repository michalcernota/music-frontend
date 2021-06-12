import React, {useState} from "react";
import {Redirect} from "react-router-dom";
import {Alert, Button, Col, Container, Form, Row} from "react-bootstrap";

function SignUp() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [signedUp, setSignedUp] = useState(false);

    function signUpHandler(e) {
        e.preventDefault();

        const newUser = {
            username: username,
            password: password,
            repeatPassword: confirmedPassword,
            emailAddress: email
        }

        fetch(`${process.env.REACT_APP_BASE_URI}/signup`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(`Unable to get data: ${response.statusText}`);
            })
            .then(json => {
                setSignedUp(true);
            })
            .catch((err) => {
                setError(err.message);
            })
    }

    if (signedUp) {
        return <Redirect to="/"/>;
    }

    return (
        <Container>
            <Row className={"mt-2"}>
                <Col>
                    <h2>Signup</h2>
                </Col>
            </Row>
            <Row>
                <Col className={"mt-3"}>
                    <Form onSubmit={signUpHandler}>
                        <Form.Group controlId="formUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type={"text"} onChange={(e) => {
                                setUsername(e.target.value)
                            }}/>
                        </Form.Group>
                        <Form.Group controlId="formEmail">
                            <Form.Label>E-Mail</Form.Label>
                            <Form.Control type={"email"} onChange={(e) => {
                                setEmail(e.target.value)
                            }}/>
                        </Form.Group>
                        <Form.Group controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type={"password"} onChange={(e) => {
                                setPassword(e.target.value)
                            }}/>
                        </Form.Group>
                        <Form.Group controlId="formPassword">
                            <Form.Label>Confirm password</Form.Label>
                            <Form.Control type={"password"} onChange={(e) => {
                                setConfirmedPassword(e.target.value)
                            }}/>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
            {error &&
            <Row>
                <Col>
                    <Alert variant={"danger"}>
                        {error}
                    </Alert>
                </Col>
            </Row>
            }
        </Container>
    )
}

export default SignUp;