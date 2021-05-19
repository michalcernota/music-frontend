import {useAuth} from "./AuthContext";

function Profile() {
    const { user, token } = useAuth()
    return <>
        <h2>Profile</h2>
        <div>
            <strong>User</strong> {JSON.stringify(user)}
        </div>
        <div>
            <strong>Token</strong> {token}
        </div>
    </>;
}

export default Profile;