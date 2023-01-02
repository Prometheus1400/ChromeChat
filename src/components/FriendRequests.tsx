import { ExpandLess, ExpandMore } from "@mui/icons-material"
import {
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    ListItem,
    Avatar,
    Typography,
    ListItemAvatar,
} from "@mui/material"
import { useState, useContext, useEffect, Fragment, useCallback } from "react"
import PersonAddIcon from "@mui/icons-material/PersonAdd"
import { UserContext } from "../context/UserContext"
import { FriendRequest, friendRequestRef, getRandomColor, usersRef } from "../config/config"
import "./FriendRequest.css"

function FriendRequestComp(props: {
    userID: string
    userEmail: string
    friendID: string
    friendEmail: string
    docID: string
    getFriendReqs: () => void
}) {
    const { userID, userEmail, friendID, friendEmail, docID, getFriendReqs } = props

    const handleAccept = () => {
        console.log("handleAccept()")

        const userDoc = usersRef.doc(userID)
        const friendDoc = usersRef.doc(friendID)
        
        userDoc.get().then(doc => {
            const user = doc.data()
            if (user === undefined) {
                console.error("issue getting user in 'handleAccept()'")
            }

            // console.log("user", user)

            user!.friends.push({
                id: friendID,
                email: friendEmail,
            })
            userDoc.set(user!)
        })
        friendDoc.get().then(doc => {
            const friend = doc.data()
            if (friend === undefined) {
                console.error("issue getting user in 'handleAccept()'")
            }
            // console.log("friend", friend)

            friend!.friends.push({
                id: userID,
                email: userEmail,
            })
            friendDoc.set(friend!)
        })

        friendRequestRef.doc(docID).delete()
        getFriendReqs()
    }
    const handleReject = () => {
        console.log("handleReject()")
        friendRequestRef.doc(docID).delete()
        getFriendReqs()
    }

    return (
        <ListItem>
            <ListItemAvatar>
                <Avatar sx={{bgcolor: getRandomColor()}} alt="friend icon">{friendEmail[0]}</Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={friendEmail}
                secondary={
                    <Typography  component={'span'} style={{ display: "flex", gap: "10px" }}>
                        <div className="textButton" onClick={handleAccept}>accept</div>
                        <div className="textButton" onClick={handleReject}>reject</div>
                    </Typography>
                }
            />
        </ListItem>
    )
}

function FriendRequests() {
    const [open, setOpen] = useState<boolean>(false)
    const [friendReqs, setFriendReqs] = useState<
        { fr: FriendRequest; docID: string }[]
    >([])
    const user = useContext(UserContext)

    const getFriendReqs = useCallback(() => {
        friendRequestRef
        .where("to", "==", user?.id)
        .get()
        .then((resp) => {
            const tempFriendReqs: { fr: FriendRequest; docID: string }[] =
                []
            resp.forEach((doc) => {
                const temp = doc.data()
                tempFriendReqs.push({
                    fr: temp,
                    docID: doc.id,
                })
            })
            if (tempFriendReqs.length > 0) {
                setOpen(true)
            }
            setFriendReqs(tempFriendReqs)
        })
    }, [user?.id])

    useEffect(() => {
        getFriendReqs()
    }, [user, getFriendReqs])

    let count = 0
    const friendReqComps = friendReqs.map((fReq) => {
        return (
            <FriendRequestComp
                userID={user?.id!}
                userEmail={user?.email!}
                friendID={fReq.fr.from.id}
                friendEmail={fReq.fr.from.email}
                docID={fReq.docID}
                getFriendReqs={getFriendReqs}
                key={count++}
            />
        )
    })

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
                <List>{friendReqComps}</List>
            </Collapse>
        </List>
    )
}

export default FriendRequests
