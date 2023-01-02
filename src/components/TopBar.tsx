import "./TopBar.css"
import { UserContext } from "../context/UserContext"
import {useContext} from "react"
import { Avatar } from "@mui/material"

function TopBar() {
    const user = useContext(UserContext)
    return (
        <div className="TopBar">
            <Avatar alt="Profile Picturre"> {user?.email[0]} </Avatar>
            {/* <SignOut /> */}
        </div>
    )
}

export default TopBar