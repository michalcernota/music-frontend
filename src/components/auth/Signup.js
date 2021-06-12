import React, {useState} from "react";
import {Redirect} from "react-router-dom";

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

        fetch(`http://localhost:8080/signup`,
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
        <div>
            <h2>Signup</h2>
            <form onSubmit={signUpHandler}>
                <input placeholder={'Username'} type={'text'} onChange={(e) => {
                    setUsername(e.target.value)
                }}/>
                <input placeholder={'E-mail address'} type={'email'} onChange={(e) => {
                    setEmail(e.target.value)
                }}/>
                <input placeholder={'Password'} type={'password'} onChange={(e) => {
                    setPassword(e.target.value)
                }}/>
                <input placeholder={'Confirm password'} type={'password'} onChange={(e) => {
                    setConfirmedPassword(e.target.value)
                }}/>
                <input type={'Submit'}/>
            </form>

            {error && error}
        </div>
    )

}

export default SignUp;