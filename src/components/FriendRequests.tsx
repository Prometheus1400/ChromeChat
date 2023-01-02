import { ExpandLess, ExpandMore } from "@mui/icons-material"
import { List, ListItemButton, ListItemIcon, ListItemText, Collapse } from "@mui/material"
import { useState } from "react"
import PersonAddIcon from '@mui/icons-material/PersonAdd';

function FriendRequest() {
    return (
        <></>
    )
}

function FriendRequests() {
    const [open, setOpen] = useState<boolean>(false)


    return (
        <List sx={{ maxHeight: "500px", overflowY: "auto" }}>
            <ListItemButton
                onClick={() => {
                    setOpen((prev) => !prev)
                }}
            >
                <ListItemIcon>
                    <PersonAddIcon />
                </ListItemIcon>
                <ListItemText primary="Friend Requests" />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                {/* Friend Request comp list here */}
                <List>{}</List>
            </Collapse>
        </List>
    )
}

export default FriendRequests
