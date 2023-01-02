import "./TopBar.css"
import { UserContext } from "../context/UserContext"
import { useContext } from "react"
import { Avatar, Divider } from "@mui/material"
import { getRandomColor } from "../config/config"

function TopBar() {
    const user = useContext(UserContext)
    const userName = user?.email.slice(0, user?.email.indexOf("@"))

    return (
        <>
            <div className="TopBar">
                <Avatar
                    sx={{ bgcolor: getRandomColor() }}
                    alt="Profile Picturre"
                >
                    {" "}
                    {user?.email[0]}{" "}
                </Avatar>
                <div
                    style={{
                        marginTop: "auto",
                        marginBottom: "auto",
                        marginLeft: "20px",
                    }}
                >
                    {userName}
                </div>
                {/* <SignOut /> */}
            </div>
            <Divider sx={{marginTop:"5px"}} light={true} variant="fullWidth" />
        </>
    )
}

export default TopBar
