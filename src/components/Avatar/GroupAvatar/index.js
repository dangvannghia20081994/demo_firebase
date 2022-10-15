import React, { useMemo } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserGroup } from "@fortawesome/free-solid-svg-icons"

import style from './GroupAvatar.module.css'
import { AvatarSkeleton } from "../../Skeleton"
import UserAvatar from "../UserAvatar"

const GroupAvatar = React.memo(function GroupAvatar({ photoURL, membersInfo }) {
    const Avatar = useMemo(() => {
        if (Boolean(photoURL)) {
            return <UserAvatar photoURL={photoURL} />

        } else if (photoURL === '' && membersInfo) {
            const membersInfoArr = Object.values(membersInfo)
            const greaterThan2 = membersInfoArr.length > 1
            return membersInfoArr.map(
                mem => (
                    <UserAvatar
                        className={greaterThan2 && style.groupAvt}
                        photoURL={mem.photoURL}
                        strAlt={mem.name}
                        key={mem.uid}
                    />
                )
            )

        } else {
            return <AvatarSkeleton />
        }
    }, [photoURL, membersInfo])

    return (
        <div className={style.wrGrAvt}>
            {Avatar}
            <div className={style.grIco}>
                <FontAwesomeIcon icon={faUserGroup} />
            </div>
        </div>
    )
})

export default GroupAvatar