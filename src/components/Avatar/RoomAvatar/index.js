import React from "react"

import GroupAvatar from "../GroupAvatar"
import UserAvatar from "../UserAvatar"

const RoomAvatar = React.memo(function RoomAvatar({ isGroup, photoURL, name, membersInfo }) {
    if (isGroup) {
        return <GroupAvatar photoURL={photoURL} membersInfo={membersInfo} />
    } else {
        return <UserAvatar photoURL={photoURL} strAlt={name} />
    }
})

export default RoomAvatar