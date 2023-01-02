import { Button } from "@mui/material"
import firebase from "firebase/compat/app"
import {auth} from "../config/config"

function SignIn() {

    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider()
        auth.signInWithPopup(provider)
        // auth.signInWithRedirect(provider)
    }

    return (
        <Button onClick={signInWithGoogle} variant="contained">Sign in with Google</Button>
    )
}

export default SignIn