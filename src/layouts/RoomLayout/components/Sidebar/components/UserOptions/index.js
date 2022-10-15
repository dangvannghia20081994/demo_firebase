import React, { useCallback, useRef } from "react"
import {
    faGear,
    faArrowRightFromBracket
} from '@fortawesome/free-solid-svg-icons'
import { getAuth, signOut } from "firebase/auth"

import style from './UserOptions.module.css'
import Item from "../../../../../../components/Item"
import { TooltipShadowStyle } from "../../../../../../components/Tooltip"
import { useDisplay as useDisplaySecondScreen } from "../../../../../../components/SecondScreen/hookControls"
import { useHideClickOutside } from "../../../../../../hooks/useHideClickOutside"

const UserOptions = React.memo(function UserOptions({ hiddenHandling }) {
    const ref = useRef()
    useHideClickOutside(ref, hiddenHandling)

    const logOut = useCallback(() => {
        const auth = getAuth()
        signOut(auth)
    }, [])

    const displaySecondScreen = useDisplaySecondScreen()

    const displaySetting = useCallback(() => {
        hiddenHandling()
        displaySecondScreen('layouts/RoomLayout/components/Setting', 'Setting')
    }, [])

    return (
        <div className={style.wrapper} ref={ref}>
            <TooltipShadowStyle>
                <Item icon={faGear} title='Tùy chọn' className={style.optionItem} onClick={displaySetting} />
                <Item icon={faArrowRightFromBracket} title='Đăng xuất'
                    className={style.optionItem} onClick={logOut} />
            </TooltipShadowStyle>
        </div>
    )
})

export default UserOptions