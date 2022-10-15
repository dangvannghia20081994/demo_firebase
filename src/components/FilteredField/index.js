import React from "react"
import { useRoomInformation } from "../../hooks/useRoomInformation"
import { RoomAvatar } from "../Avatar"

import style from './FilteredField.module.css'

const FilteredField = React.memo(function FilteredField({ roomID, isGroup, uid, onClick }) {
    const roomInfo = useRoomInformation({ roomID, isGroup, fUID: uid })

    return (
        <div className={style.user} onClick={onClick}>
            <div className={style.avt}>
                <RoomAvatar
                    isGroup={isGroup}
                    photoURL={roomInfo.photoURL}
                    name={roomInfo.name}
                    membersInfo={roomInfo.membersInfo}
                />
            </div>
            <h3 className={style.name}>{roomInfo.name}</h3>
        </div>
    )
})

export default FilteredField