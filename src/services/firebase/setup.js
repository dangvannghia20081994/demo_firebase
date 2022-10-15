import { initializeApp } from 'firebase/app'
import { getDatabase } from "firebase/database"

const firebaseConfig = {
    // apiKey: "AIzaSyAHRwCfXcmRzlcBiee5gHBxHtuiZYVAgTQ",
    // authDomain: "chatapp-41383.firebaseapp.com",
    // projectId: "chatapp-41383",
    // storageBucket: "chatapp-41383.appspot.com",
    // messagingSenderId: "325256572151",
    // appId: "1:325256572151:web:6648632e4d05864ea6f7f2",
    // databaseURL: "https://chatapp-41383-default-rtdb.asia-southeast1.firebasedatabase.app/"

    apiKey: "AIzaSyAo6ORfUhK7Wac2fzSNb2HXybtjbg-5FfA",
    authDomain: "chatapp3009.firebaseapp.com",
    projectId: "chatapp3009",
    storageBucket: "chatapp3009.appspot.com",
    messagingSenderId: "853951417562",
    appId: "1:853951417562:web:64a2e2e7921ff27b9469e3",
    databaseURL: "https://chatapp3009-default-rtdb.asia-southeast1.firebasedatabase.app"
}

export const firebaseApp = initializeApp(firebaseConfig)

// Resourse
export const database = getDatabase(firebaseApp)