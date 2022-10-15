import React, { useCallback, useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ref, onValue, set, getDatabase, push } from 'firebase/database'
import { getAuth } from "firebase/auth"

import style from './Conversation.module.css'
import Controls from "./components/Controls"
import MessagesBox from "./components/MessagesBox"
import Chat from "./components/Chat"

const Conversation = React.memo(function Conversation() {
    const conversationRef = useRef()
    const navigate = useNavigate()
    const database = getDatabase()
    const auth = getAuth()
    const user = auth.currentUser
    const [unseenMessages, setUnseenMessages] = useState({})
    const [messageReplyInfo, setMessageReplyInfo] = useState({})
    const [autoScroll, setAutoScroll] = useState(true)
    const [scroll, setScroll] = useState(true)
    const param = useParams()
    const [isNewConversation, setIsNewConversation] = useState(false)
    const [roomDescription, setRoomDescription] = useState({})
    const [isCheckParamID, setIsCheckParamID] = useState(false)

    useEffect(() => {
        const roomDesRef = ref(database, 'users/' + user.uid + '/chats/' + param.id)
        const unsub = onValue(roomDesRef, (snapshot) => {
            let roomDes
            if (snapshot.val()) {
                const { isGroup, carrier, roomID } = snapshot.val()
                roomDes = { isGroup, carrier, roomID, roomKey: param.id }
            } else {
                const newRoomRef = push(ref(database, 'rooms'))
                const newRoomKey = newRoomRef.key
                roomDes = {
                    isGroup: false,
                    carrier: {
                        fUID: param.id,
                        roomID: newRoomKey
                    },
                    roomID: newRoomKey,
                    roomKey: param.id
                }
                setIsNewConversation(true)
            }

            setRoomDescription(roomDes)
        })

        return () => unsub()
    }, [param.id])

    useEffect(() => {
        if (Object.keys(roomDescription).length < 1) return

        const { isGroup, carrier, roomID } = roomDescription
        const refCheck = isGroup ? ref(database, 'rooms/' + roomID) : ref(database, 'users/' + carrier.fUID)

        const unsub = onValue(refCheck, (snapshot) => {
            if (snapshot.val() === null) {
                navigate('/room')
            } else {
                setIsCheckParamID(true)
            }
        })

        return () => unsub()
    }, [roomDescription])

    const handleReplyMessage = useCallback((messageReplyData) => {
        messageReplyData.focus = true
        setMessageReplyInfo(messageReplyData)
    }, [])

    const handleCloseReplyMessage = useCallback(() => {
        setMessageReplyInfo({})
    }, [])

    useEffect(() => {
        if (Object.keys(roomDescription).length < 1 || !isCheckParamID) return
        setTimeout(() => conversationRef.current.classList.add(style.active))
    }, [roomDescription, isCheckParamID])

    const handleBackToRoom = useCallback(() => {
        conversationRef.current.classList.remove(style.active)
        setTimeout(() => navigate('/room'), 350)
    }, [])

    useEffect(() => {
        const unseenRef = ref(database, 'users/' + user.uid + '/unseenMessages')
        const unsub = onValue(unseenRef, (snapshot) => {
            const unseenMessages = snapshot.val() ?? {}
            setUnseenMessages(unseenMessages)
        })

        return () => unsub()
    }, [])

    useEffect(() => {
        if (Object.keys(unseenMessages).length < 1 || Object.keys(roomDescription).length < 1) return
        const { roomID: currentRoomID } = roomDescription

        for (let roomID in unseenMessages) {
            if (roomID != currentRoomID) continue
            const messageKey = Object.values(unseenMessages[roomID])
            messageKey.forEach((messKey) => {
                const messRef = ref(database, 'rooms/' + roomID + '/conversation/' + messKey + '/status/' + user.uid)
                const unseenRef = ref(database, 'users/' + user.uid + '/unseenMessages/' + roomID)
                set(messRef, 'seen')
                set(unseenRef, null)
            })
        }
    }, [unseenMessages, roomDescription])

    return (
        Object.keys(roomDescription).length > 0 &&
        isCheckParamID &&
        <>
            <div className={style.conversation} ref={conversationRef}>
                <Controls
                    handleBackToRoom={handleBackToRoom}
                    conversationRef={conversationRef}
                    classActive={style.active}
                    roomDescription={roomDescription}
                />
                <MessagesBox
                    handleReplyMessage={handleReplyMessage}
                    autoScroll={autoScroll}
                    setAutoScroll={setAutoScroll}
                    scroll={scroll}
                    setScroll={setScroll}
                    roomDescription={roomDescription}
                />
                <Chat
                    messageReplyInfo={messageReplyInfo}
                    handleCloseReplyMessage={handleCloseReplyMessage}
                    setAutoScroll={setAutoScroll}
                    setScroll={setScroll}
                    isNewConversation={isNewConversation}
                    setIsNewConversation={setIsNewConversation}
                    roomDescription={roomDescription}
                />
            </div>
        </>
    )
})

export default Conversation