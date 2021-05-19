import {useAuth} from "./AuthContext";
import {Redirect} from "react-router-dom";

function Logout() {
    const { removeTokens } = useAuth()
    removeTokens()
    return <Redirect to="/"/>;
}

export default Logout;