import { Button } from "@mui/material"
import { auth } from "../config/config"

function SignOut() {
    return (
        <Button
            size="small"
            onClick={() => auth.signOut()}
            variant="contained"
            sx={{ marginLeft: "auto" }}
        >
            Sign Out
        </Button>
    )
}

export default SignOut
