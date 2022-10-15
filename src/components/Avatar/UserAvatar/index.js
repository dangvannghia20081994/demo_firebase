import clsx from "clsx"
import React from "react"

import DefaultAvatar from "../DefaultAvatar"
import style from './UserAvatar.module.css'

const UserAvatar = React.memo(function UserAvatar({ photoURL, strAlt, className }) {
    return (
        (
            photoURL ?
                <img src={photoURL} className={clsx(style.imgAvt, className)} /> :
                <DefaultAvatar className={className} strToAvt={strAlt} />
        )
    )
})

export default UserAvatar