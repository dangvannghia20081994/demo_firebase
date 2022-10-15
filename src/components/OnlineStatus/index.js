import React from "react"

import { useFriendStatus } from "../../hooks/useFriendStatus"
import { useLastTimeOnline } from "../../hooks/useLastTimeOnline"
import style from './OnlineStatus.module.css'

const Online = React.memo(function Online() {
    return <div className={style.active}></div>
})

const Offline = React.memo(function Offline({ userID }) {
    const { timeline } = useLastTimeOnline(userID)

    return (
        <div className={style.isOnline}>
            <span className={style.content}>{timeline}</span>
        </div>
    )
})

const OnlineStatus = React.memo(function OnlineStatus({ userID, showOfflineStt = true }) {
    const isOnline = useFriendStatus(userID)

    return (
        isOnline ? <Online /> :
            (showOfflineStt ? <Offline userID={userID} /> : false)
    )
})

export default OnlineStatus