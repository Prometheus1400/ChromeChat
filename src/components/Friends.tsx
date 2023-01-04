import { useContext, useState } from "react"
import { UserContext } from "../context/UserContext"
import {
    User,
    usersRef,
    friendRequestRef,
    FriendRequest,
    getRandomColor,
} from "../config/config"
import { useNavigate } from "react-router-dom"
import "./Friends.css"
import {
    Avatar,
    Button,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    TextField,
} from "@mui/material"
import PeopleAltIcon from "@mui/icons-material/PeopleAlt"
import { ExpandLess, ExpandMore } from "@mui/icons-material"
import AddIcon from "@mui/icons-material/Add"
import { useTheme } from '@mui/material/styles';


function FriendComp(props: {
    friendID: string
    userID: string
    friendEmail: string
}) {
    const { userID, friendID, friendEmail } = props
    const navigate = useNavigate()
    const friendUserName = friendEmail.slice(0, friendEmail.indexOf("@"))

    const handleClick = () => {
        const chatURL =
            "/chat/" + userID + "/" + friendID + "/" + friendUserName
        navigate(chatURL, { replace: true })
    }

    return (
        <ListItemButton onClick={handleClick} sx={{ pl: "20px" }}>
            <ListItemAvatar>
                <Avatar
                    sx={{ bgcolor: getRandomColor() }}
                    alt="Profile Picturre"
                >
                    {" "}
                    {friendEmail[0]}{" "}
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={friendUserName} />
        </ListItemButton>
    )
}

function AddFriend(props: { userID: string; userEmail: string }) {
    const { userID, userEmail } = props
    const [open, setOpen] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)
    const [errorMsg, setErrorMsg] = useState<string>("")
    const errMsgs = [
        "Not a valid email address",
        "This user does not exist",
        "cannot send friend request",
    ]
    const [email, setEmail] = useState<string>("")

    const validateEmail = (str: string): RegExpMatchArray | null => {
        return String(str)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )
    }

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
        setEmail("")
        setError(false)
        setErrorMsg("")
    }

    const handleSubmit = () => {
        if (!validateEmail(email)) {
            setError(true)
            setErrorMsg(errMsgs[0])
            return
        }
        usersRef
            .where("email", "==", email)
            .limit(1)
            .get()
            .then((resp) => {
                if (resp.empty) {
                    console.log("no such user with email", email, "in database")
                    setError(true)
                    setErrorMsg(errMsgs[1])
                }
                resp.forEach((doc) => {
                    const otherUser: User = doc.data()

                    const friendReq: FriendRequest = {
                        to: otherUser.id,
                        from: {
                            id: userID,
                            email: userEmail,
                        },
                    }
                    friendRequestRef
                        .add(friendReq)
                        .then((doc) => {
                            console.log("success adding friend request", doc.id)
                            handleClose()
                        })
                        .catch((err) => {
                            console.log("error adding friend request", err)
                            setError(true)
                            setErrorMsg(errMsgs[2])
                        })
                })
            })
    }

    return (
        <div className="dialogContainer">
            <ListItemButton onClick={handleClickOpen} sx={{ pl: "20px" }}>
                <ListItemIcon>
                    <AddIcon />
                </ListItemIcon>
                <ListItemText primary="Add Friend" />
            </ListItemButton>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Enter Friends Email</DialogTitle>
                <DialogContent>
                    <TextField
                        error={error}
                        helperText={errorMsg}
                        autoFocus
                        autoComplete="off"
                        margin="dense"
                        id="name"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

function Friends() {
    const user: User | null = useContext(UserContext)
    const [open, setOpen] = useState<boolean>(true)

    let count = 0
    const friendComps = user?.friends?.map((friend) => {
        return (
            <FriendComp
                key={count++}
                friendID={friend.id}
                userID={user.id}
                friendEmail={friend.email}
            />
        )
    })

    const theme = useTheme()

    return (
        <>
                <ListItemButton sx={{maxHeight:"48px", position:"relative"}}
                    onClick={() => {
                        setOpen((prev) => !prev)
                    }}
                >
                    <ListItemIcon>
                        <PeopleAltIcon />
                    </ListItemIcon>
                    <ListItemText primary="Friends" />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse sx={{overflowY:"auto", position:"relative"}} in={open} timeout="auto" unmountOnExit>
                    <List>
                        <AddFriend
                            userID={user?.id!}
                            userEmail={user?.email!}
                        />
                        {friendComps}
                    </List>
                </Collapse>
        </>
    )
}

export default Friends
