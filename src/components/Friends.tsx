import { useContext, useState } from "react"
import { UserContext } from "../context/UserContext"
import { User, usersRef } from "../config/config"
import { useNavigate } from "react-router-dom"
import "./Friends.css"
import {
    Collapse,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import PersonIcon from "@mui/icons-material/Person"
import PeopleAltIcon from "@mui/icons-material/PeopleAlt"
import { ExpandLess, ExpandMore } from "@mui/icons-material"

const MyList = styled(List)(
    ({ theme }) => `
    color:${theme.palette.text.primary};
  `
)

const MyListItemButton = styled(ListItemButton)(
    ({ theme }) => `
    `
)

function Friend(props: {
    friendID: string
    userID: string
    friendEmail: string
}) {
    const { userID, friendID, friendEmail } = props
    const navigate = useNavigate()

    const handleClick = () => {
        const chatURL = "/chat/" + userID + "/" + friendID
        navigate(chatURL, { replace: true })
    }

    return (
        <MyListItemButton onClick={handleClick} sx={{ pl: "40px" }}>
            <ListItemIcon>
                <PersonIcon />
            </ListItemIcon>
            <ListItemText primary={friendEmail} />
        </MyListItemButton>
    )
}

function Friends() {
    const user: User = useContext(UserContext)!
    const [open, setOpen] = useState<boolean>(true)

    let count = 0
    const friendComps = user.friends.map((friend) => {
        return (
            <Friend
                key={count++}
                friendID={friend.id}
                userID={user.id}
                friendEmail={friend.email}
            />
        )
    })

    return (
        <MyList sx={{maxHeight:"500px", overflowY:"auto"}}>
            <MyListItemButton
                onClick={() => {
                    setOpen((prev) => !prev)
                }}
            >
                <ListItemIcon>
                    <PeopleAltIcon />
                </ListItemIcon>
                <ListItemText primary="Friends" />
                {open ? <ExpandLess /> : <ExpandMore />}
            </MyListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <MyList>{friendComps}</MyList>
            </Collapse>
        </MyList>
    )
}

export default Friends
