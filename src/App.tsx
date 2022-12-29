import { useState, useEffect, useCallback } from "react"
import "firebase/compat/firestore"
import { UserContext } from "./context/UserContext"
import Friends from "./components/Friends"
import { usersRef, User } from "./config/config"
import FriendRequests from "./components/FriendRequests"
import { Outlet, Route, Routes } from "react-router-dom"
import Chat from "./components/Chat"
import { styled } from "@mui/material/styles"

const MyApp = styled("div")(
    ({ theme }) => `
    background-color: ${theme.palette.background.default};
    text-align: center;
    width: 300px;
    height: 500px;
  `
)

function App() {
    const [user, setUser] = useState<User>({
        id: "",
        email: "",
        friends: [],
        friendRequests: [],
    })

    const getUser = useCallback(() => {
        // for use with npm start
        if (process.env.NODE_ENV === "development") {
            const info = {
                id: "3",
                email: "prometheus1400@gmail.com",
            }
            const docRef = usersRef.doc(info.id)
            docRef.get().then((doc) => {
                if (doc.exists) {
                    console.log("getUser(): ", doc.data())
                    const tempUser = doc.data()!
                    console.log("tempUser", tempUser)
                    setUser(tempUser)
                } else {
                    // if no results create user in database
                    usersRef.doc(info.id).set(user)
                }
            })
        }
        // production / extension ready build
        else {
            chrome.identity.getProfileUserInfo((info) => {
                console.log("TODO")
            })
        }
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        getUser()
    }, [getUser])

    console.log("Current user: ", user)

    return (
        <UserContext.Provider value={user}>
            <Routes>
                <Route
                    element={
                        <MyApp>
                            <Outlet />
                        </MyApp>
                    }
                >
                    <Route
                        path="/"
                        element={
                            <>
                                <Friends />
                                <FriendRequests />
                            </>
                        }
                    />
                    <Route path="/chat/:userID/:friendID" element={
                        <Chat />
                    } />
                </Route>
            </Routes>
        </UserContext.Provider>
    )
}

export default App
