import { useContext, useState } from "react"
import { UserContext } from "../context/UserContext"
import { User, usersRef } from "../config/config"
import { useNavigate } from "react-router-dom"
import "./Friends.css"
import {
    Button,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    TextField,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import PersonIcon from "@mui/icons-material/Person"
import PeopleAltIcon from "@mui/icons-material/PeopleAlt"
import { ExpandLess, ExpandMore } from "@mui/icons-material"
import AddIcon from "@mui/icons-material/Add"

const MyDialog = styled(Dialog)(({theme}) => ({
    "& .MuiDialog-container": {
      alignItems: "flex-start"
    },
    "width":"50%",
}))

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
        <ListItemButton onClick={handleClick} sx={{ pl: "20px" }}>
            <ListItemIcon>
                <PersonIcon />
            </ListItemIcon>
            <ListItemText primary={friendEmail} />
        </ListItemButton>
    )
}

function AddFriend() {
    const [open, setOpen] = useState<boolean>(false)

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleSubmit = () => {}

    return (
        <div className="dialogContainer">
            <ListItemButton onClick={handleClickOpen} sx={{ pl: "20px" }}>
                <ListItemIcon>
                    <AddIcon />
                </ListItemIcon>
                <ListItemText primary="Add Friend" />
            </ListItemButton>

            <MyDialog open={open} onClose={handleClose}>
                <DialogTitle>Enter Friends Email</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To subscribe to this website, please enter your email
                        address here. We will send updates occasionally.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleClose}>Subscribe</Button>
                </DialogActions>
            </MyDialog>
        </div>
    )
}

function Friends() {
    const user: User | null = useContext(UserContext)
    const [open, setOpen] = useState<boolean>(true)

    let count = 0
    const friendComps = user?.friends?.map((friend) => {
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
        <List sx={{ maxHeight: "500px", overflowY: "auto" }}>
            <ListItemButton
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
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List>
                    <AddFriend />
                    {friendComps}
                </List>
            </Collapse>
        </List>
    )
}

export default Friends
