import { useContext, useState } from "react"
import { UserContext } from "../context/UserContext"
import { User, usersRef } from "../config/config"
import { useNavigate } from "react-router-dom"
import "./Friends.css"
import { List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import { styled } from "@mui/material/styles"
import PersonIcon from '@mui/icons-material/Person';

const MyList = styled(List)(
    ({ theme }) => `
    color:${theme.palette.text.primary};
  `
)

const MyListItemButton = styled(ListItemButton)(
    ({theme}) => `
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
        <MyListItemButton onClick={handleClick}>
            <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
            <ListItemText primary={friendEmail} />
        </MyListItemButton>
    )
}

function Friends() {
    const user: User = useContext(UserContext)!

    let count = 0
    const friendComps = user.friends.map((friend) => {
        console.log(friend)
        return (
            <Friend
                key={count++}
                friendID={friend.id}
                userID={user.id}
                friendEmail={friend.email}
            />
        )
    })

    return <MyList>{friendComps}</MyList>
}

export default Friends
