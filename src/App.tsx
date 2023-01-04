import { useState, useEffect, useCallback, useMemo } from "react"
import "firebase/compat/firestore"
import { UserContext } from "./context/UserContext"
import Friends from "./components/Friends"
import { usersRef, User } from "./config/config"
import FriendRequests from "./components/FriendRequests"
import { Outlet, Route, Routes } from "react-router-dom"
import Chat from "./components/Chat"
import { createTheme, styled, ThemeProvider } from "@mui/material/styles"
import { CssBaseline, useMediaQuery } from "@mui/material"
import TopBar from "./components/TopBar"

const MyApp = styled("div")(
    ({ theme }) => `
    background-color: ${theme.palette.background.default};
    text-align: center;
    width: 300px;
    height: 500px;
    max-height: 500px;
    min-height: 500px;
    position: relative;

    display: flex;
    flex-direction: column;
  `
)

function App() {
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)")
    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: prefersDarkMode ? "dark" : "light",
                },
            }),
        [prefersDarkMode]
    )
    const [user, setUser] = useState<User | null>(null)

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
                    const tempUser: User = {
                        id: info.id,
                        email: info.email,
                        friends: [],
                    }
                    usersRef.doc(info.id).set(tempUser)
                    setUser(tempUser)
                }
            })
        }
        // production / extension ready build
        else {
            chrome.identity.getProfileUserInfo((info) => {
                console.log("info")
                const docRef = usersRef.doc(info.id)
                docRef.get().then((doc) => {
                    if (doc.exists) {
                        console.log("getUser(): ", doc.data())
                        const tempUser = doc.data()!
                        setUser(tempUser)
                    } else {
                        // if no results create user in database
                        const tempUser: User = {
                            id: info.id,
                            email: info.email,
                            friends: [],
                        }
                        usersRef.doc(info.id).set(tempUser)
                        setUser(tempUser)
                    }
                })
            })
        }
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        getUser()
    }, [getUser])

    console.log("Current user: ", user)

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
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
                                user ? (
                                    <>
                                        <TopBar />
                                        <FriendRequests />
                                        <Friends />
                                    </>
                                ) : (
                                    // <SignIn />
                                    <></>
                                )
                            }
                        />
                        <Route
                            path="/chat/:userID/:friendID/:friendName"
                            element={<Chat />}
                        />
                    </Route>
                </Routes>
            </UserContext.Provider>
        </ThemeProvider>
    )
}

export default App
