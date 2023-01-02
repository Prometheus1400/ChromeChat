import firebase from "firebase/compat/app"
import "firebase/compat/firestore"
import "firebase/compat/auth"

firebase.initializeApp({
    apiKey: "AIzaSyAZixDyHYy43pjsByJClzGILfRnEzFt4yo",
    authDomain: "ce-sendnotification.firebaseapp.com",
    projectId: "ce-sendnotification",
    storageBucket: "ce-sendnotification.appspot.com",
    messagingSenderId: "735983992715",
    appId: "1:735983992715:web:d30c04db923a7fee88798e",
    measurementId: "G-SVCM8M5EHK",
})

// interfaces for users
interface Friend {
    id: string
    email: string
    // photoURL: string
    // name: string
}

export interface User {
    id: string
    email: string
    // photoURL: string
    // displayName: string
    friends: Friend[]
    friendRequests: []
}

// interfaces for messaging
export interface Message {
    members: string[]
    value: string
    from: string
    createdAt: firebase.firestore.FieldValue
}

export const firestore = firebase.firestore()
export const auth = firebase.auth()

const userConverter = {
    toFirestore(user: User): firebase.firestore.DocumentData {
        return {
            id: user.id,
            email: user.email,
            // photoURL: user.photoURL,
            // name: user.displayName,
            friends: user.friends,
            friendRequests: user.friendRequests,
        }
    },
    fromFirestore(
        snapshot: firebase.firestore.QueryDocumentSnapshot,
        options: firebase.firestore.SnapshotOptions
    ): User {
        const data = snapshot.data(options)
        return {
            id: data.id,
            email: data.email,
            // photoURL: data.photoURL,
            // displayName: data.name,
            friends: data.friends,
            friendRequests: data.friendRequests,
        }
    },
}

const chatRoomsConverter = {
    toFirestore(message: Message): firebase.firestore.DocumentData {
        return {
            members: message.members,
            value: message.value,
            from: message.from,
            createdAt: message.createdAt,
        }
    },
    fromFirestore(
        snapshot: firebase.firestore.QueryDocumentSnapshot,
        options: firebase.firestore.SnapshotOptions
    ): Message {
        const data = snapshot.data(options)
        return {
            members: data.members,
            value: data.value,
            from: data.from,
            createdAt: data.createdAt,
        }
    },
}

export const usersRef = firestore
    .collection("users")
    .withConverter(userConverter)

export const chatRoomsRef = firestore
    .collection("chat_rooms")
    .withConverter(chatRoomsConverter)
