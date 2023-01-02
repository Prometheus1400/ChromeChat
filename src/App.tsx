import { useState, useEffect, useCallback, useMemo } from "react"
import firebase from "firebase/compat/app"
import "firebase/compat/firestore"
import { UserContext } from "./context/UserContext"
import Friends from "./components/Friends"
import { usersRef, User, auth } from "./config/config"
import FriendRequests from "./components/FriendRequests"
import { Outlet, Route, Routes } from "react-router-dom"
import Chat from "./components/Chat"
import { createTheme, styled, ThemeProvider } from "@mui/material/styles"
import { Button, CssBaseline, useMediaQuery } from "@mui/material"
import SignIn from "./components/SignIn"
import SignOut from "./components/SignOut"
import TopBar from "./components/TopBar"

const MyApp = styled("div")(
    ({ theme }) => `
    background-color: ${theme.palette.background.default};
    text-align: center;
    width: 300px;
    height: 500px;
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

    // useEffect(() => {
    //     console.log("getting auth token")
    //     chrome.identity.getAuthToken({ 'interactive': true }, (token) => {
    //         console.log("token: " + token);
            // let credential = firebase.auth.GoogleAuthProvider.credential(null, token);
            // firebase.auth().signInWithCredential(credential)
            //     .then((result) => {
            //         console.log("Login successful!");
            //         console.log(result.user);
            //     })
            //     .catch((error) => {
            //         console.error(error);
            //     });
        // });

        // const docRef = usersRef.doc(googleUser.uid)
        // docRef.get().then((doc) => {
        //     if (doc.exists) {
        //         console.log("getUser(): ", doc.data())
        //         if (doc.data() === undefined) {
        //             console.log("failed retrieving user from database")
        //         } else {
        //             setUser(doc.data()!)
        //         }
        //     } else {
        //         // if no results create user in database
        //         console.log("Need to create new user for:", googleUser)
        //         const tempUser: User = {
        //             uid: googleUser.uid,
        //             email: googleUser.email,
        //             photoURL: googleUser.photoURL,
        //             displayName: googleUser.displayName,
        //             friends: [],
        //             friendRequests: [],
        //         }
        //         usersRef.doc(googleUser.uid).set(tempUser)
        //         setUser(tempUser)
        //     }
        // })
    // }, [])

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
                            path="/chat/:userID/:friendID"
                            element={<Chat />}
                        />
                    </Route>
                </Routes>
            </UserContext.Provider>
        </ThemeProvider>
    )
}

export default App
