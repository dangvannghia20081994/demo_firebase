import React, { useEffect, useState } from "react"
import { getDatabase, onDisconnect, onValue, push, ref, serverTimestamp, set } from 'firebase/database'
import { getAuth } from "firebase/auth"

import DefaultLayout from "../DefaultLayout"
import Sidebar from "./components/Sidebar"

import style from './RoomLayout.module.css'

const RoomLayout = React.memo(function RoomLayout({ children }) {
    const database = getDatabase()
    const auth = getAuth()
    const user = auth.currentUser
    const [unseenMessages, setUnseenMessages] = useState({})

    // Is user online???
    useEffect(() => {
        const lastTimeOnlineRef = ref(database, 'users/' + user.uid + '/lastOnline')
        const connectedRef = ref(database, '.info/connected')
        const myConnectionsRef = ref(database, 'users/' + user.uid + '/connections')
        let connectionRef, connectionOnDisconnectRef, lastTimeOnLineOnDisconnectRef

        onValue(connectedRef, (snap) => {
            if (snap.val() === true) {
                connectionRef = push(myConnectionsRef)

                connectionOnDisconnectRef = onDisconnect(connectionRef)
                connectionOnDisconnectRef.remove()
                set(connectionRef, true)

                lastTimeOnLineOnDisconnectRef = onDisconnect(lastTimeOnlineRef)
                lastTimeOnLineOnDisconnectRef.set(serverTimestamp())
            }
        })

        return () => {
            // when user loggout
            set(connectionRef, null)
            set(lastTimeOnlineRef, Date.now())
            connectionOnDisconnectRef.cancel()
            lastTimeOnLineOnDisconnectRef.cancel()
        }
    }, [])

    useEffect(() => {
        const unseenRef = ref(database, 'users/' + user.uid + '/unseenMessages')
        const unsub = onValue(unseenRef, (snapshot) => {
            const updateUnseen = snapshot.val() ?? {}
            setUnseenMessages(updateUnseen)
        })

        return () => unsub()
    }, [])

    useEffect(() => {
        if (Object.keys(unseenMessages).length < 1) return

        for (let roomID in unseenMessages) {
            const messageKey = Object.values(unseenMessages[roomID])
            messageKey.forEach((messKey) => {
                const messRef = ref(database, 'rooms/' + roomID + '/conversation/' + messKey + '/status/' + user.uid)
                set(messRef, 'sent')
            })
        }
    }, [unseenMessages])

    return (
        <DefaultLayout>
            <div className={style.room}>
                <Sidebar />
                {children}
            </div>
        </DefaultLayout>
    )
})

export default RoomLayout