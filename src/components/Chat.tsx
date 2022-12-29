import { Link, useNavigate, useParams } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { chatRoomsRef } from "../config/config"
import { useCollectionData } from "react-firebase-hooks/firestore"
import { Message } from "../config/config"
import firebase from "firebase/compat/app"
import "firebase/compat/firestore"
import "./Chat.css"
import { Button, CircularProgress, TextField } from "@mui/material"
import { styled } from "@mui/material/styles"

const UserMessage = styled("div")(
    ({ theme }) => `
    background-color: ${theme.palette.primary.light};
  `
)
const FriendMessage = styled("div")(
    ({ theme }) => `
    background-color: ${theme.palette.secondary.light};
  `
)
const MessagesBackground = styled("div")(
    ({ theme }) => `
    background-color: ${theme.palette.action.hover};
  `
)

function MessageComp(props: { value: string; from: string; userID: string }) {
    const { value, from, userID } = props

    return (
        <div className="Message">
            {from === userID && <UserMessage className="userMessage">{value}</UserMessage>}
            {from !== userID && <FriendMessage className="friendMessage">{value}</FriendMessage>}
        </div>
    )
}

function Chat() {
    const { userID, friendID } = useParams<string>()
    const [text, setText] = useState<string>("")
    const navigate = useNavigate()
    const messagesEndRef = useRef<null | HTMLDivElement>(null)
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const members = [userID!, friendID!]
    members.sort()
    const chatQuery = chatRoomsRef
        .where("members", "==", members)
        .orderBy("createdAt", "desc")
        .limit(12)
        // .limit(2)
    const [messages, loading, error] = useCollectionData<Message>(chatQuery)

    useEffect(() => {
        console.log("messages:", messages)
        scrollToBottom()
    }, [messages])
    // const messages = [
    //     {
    //         members: ["1", "3"],
    //         value: "hello",
    //         from: "3",
    //         createdAt: {
    //             seconds: 1672242586,
    //             nanoseconds: 228000000,
    //         },
    //     },
    //     {
    //         members: ["1", "3"],
    //         value: "how are you",
    //         from: "3",
    //         createdAt: {
    //             seconds: 1672242591,
    //             nanoseconds: 490000000,
    //         },
    //     },
    //     {
    //         members: ["1", "3"],
    //         value: "I'm good",
    //         from: "3",
    //         createdAt: {
    //             seconds: 1672242607,
    //             nanoseconds: 885000000,
    //         },
    //     },
    //     {
    //         members: ["1", "3"],
    //         value: "hello I am the greatest, the best who ever lived",
    //         from: "3",
    //         createdAt: {
    //             seconds: 1672242749,
    //             nanoseconds: 330000000,
    //         },
    //     },
    //     {
    //         members: ["1", "3"],
    //         from: "1",
    //         value: "I'm kate",
    //         createdAt: {
    //             seconds: 1672244384,
    //             nanoseconds: 634000000,
    //         },
    //     },
    // ]

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void => {
        console.log("handleChange()")
        setText(event.currentTarget.value)
    }

    const handleSubmit = (event: any): void => {
        event.preventDefault()
        console.log("handleSubmit()")
        const msgToAdd: Message = {
            members: members,
            value: text,
            from: userID!,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        }
        chatRoomsRef
            .add(msgToAdd)
            .then((docRef) => {
                console.log("Document written with ID: ", docRef.id)
            })
            .catch((error) => {
                console.error("Error adding document: ", error)
            })
        setText("")
    }
    let count = 0
    const msgComps = messages?.map((msg) => {
        return (
            <MessageComp
                key={count++}
                value={msg.value}
                from={msg.from}
                userID={userID!}
            />
        )
    })

    return (
        <>
            {loading && <CircularProgress color="secondary" />}
            {!loading && (
                <div className="Chat">
                    <div style={{ display: "flex" }}>
                        <Button
                            variant="contained"
                            size="small"
                            sx={{
                                marginRight: "auto",
                                marginLeft: "2px",
                                marginTop: "2px",
                            }}
                            onClick={() => {
                                navigate("/", { replace: true })
                            }}
                        >
                            Back
                        </Button>
                    </div>
                    <MessagesBackground className="messagesBackground">
                        <div className="messages">
                            {msgComps?.reverse()}
                            <div ref={messagesEndRef} />
                        </div>
                    </MessagesBackground>
                    <form
                        noValidate
                        autoComplete="off"
                        className="textArea"
                        onSubmit={handleSubmit}
                    >
                        <TextField
                            id="outlined-basic"
                            variant="outlined"
                            value={text}
                            onChange={handleChange}
                            size="small"
                            color="primary"
                        />
                        <Button onClick={handleSubmit} variant="contained">
                            Send
                        </Button>
                    </form>
                </div>
            )}
        </>
    )
}

export default Chat
