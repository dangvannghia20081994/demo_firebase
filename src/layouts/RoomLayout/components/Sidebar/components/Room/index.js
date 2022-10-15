import React, { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import style from './Room.module.css'
import { useRoomInformation } from "../../../../../../hooks/useRoomInformation"
import { RoomAvatar } from "../../../../../../components/Avatar"
import LastMessage from "./components/LastMessage"
import OnlineStatus from "../../../../../../components/OnlineStatus"
import { getAuth } from "firebase/auth"
import { getDatabase, onValue, ref } from "firebase/database"

const Room = React.memo(
    function Room({ roomID, isGroup, carrier, lastMessage }) {
        const roomInfo = useRoomInformation({ roomID, isGroup, fUID: carrier?.fUID })
        const navigate = useNavigate()
        const auth = getAuth()
        const user = auth.currentUser
        const database = getDatabase()
        const [hasUnseenMessage, setHasUnseenMessage] = useState(false)

        const handleChooseConversation = useCallback(() => {
            const url = '/room/' + (isGroup ? roomID : carrier.fUID)
            navigate(url)
        }, [])

        useEffect(() => {
            const unseenMessageRef = ref(database, 'users/' + user.uid + '/unseenMessages')
            const unsub = onValue(unseenMessageRef, (snapshot) => {
                const response = snapshot.val()
                const roomUnseen = response ? Object.keys(response) : []
                if (roomUnseen.includes(roomID)) {
                    setHasUnseenMessage(true)
                } else {
                    setHasUnseenMessage(false)
                }
            })

            return () => unsub()
        }, [])

        return (
            <div className={style.room} onClick={handleChooseConversation}>
                <div className={style.left}>
                    <div className={style.avatar}>
                        <RoomAvatar
                            isGroup={isGroup}
                            photoURL={roomInfo.photoURL}
                            name={roomInfo.name}
                            membersInfo={roomInfo.membersInfo}
                        />
                    </div>
                    {
                        isGroup ||
                        <div className={style.onlineStt}>
                            <OnlineStatus userID={carrier?.fUID} />
                        </div>
                    }
                </div>
                <div className={style.right}>
                    <h3 className={style.displayName}>{roomInfo.name}</h3>
                    <div className={style.messWr}>
                        <LastMessage
                            isGroup={isGroup}
                            lastMessage={lastMessage}
                            unseen={hasUnseenMessage}
                        />
                    </div>
                </div>
                {
                    hasUnseenMessage &&
                    <div className={style.status}></div>
                }
            </div>
        )
    }
)

export default Room