import { Redirect } from "react-router-dom";
import { useAuth } from "./AuthContext";
import React, { useState } from 'react';

function LoginForm() {

    const [isLoggedIn, setLoggedIn] = useState(false);
    const [isError, setIsError] = useState(false);
    const [data, setData] = useState({});
    const { setTokens } = useAuth();

    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        data[name] = value
        setData({ ...data })
    }

    function postLogin(e) {
        e.preventDefault()

        fetch(`http://localhost:8080/authenticate`,
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
        <div>
            <form onSubmit={postLogin}>
                <input placeholder={"Username"} type={"text"} name={"username"} onChange={handleInputChange}/>
                <input placeholder={"Password"} type={"password"} name={"password"} onChange={handleInputChange}/>
                <button>Login</button>
                {isError}
            </form>
        </div>

    )
}

export default LoginForm;