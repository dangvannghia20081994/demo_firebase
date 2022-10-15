import React, { useCallback, useRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCamera, faPencil } from "@fortawesome/free-solid-svg-icons"
import { getAuth } from "firebase/auth"
import { v4 as uuidv4 } from "uuid"

import style from './AccSetting.module.css'
import { useAdd as useAddToast } from "../../../../../../components/Toasts/hookControls"
import AvatarUpdate from "../AvatarUpdate"
import NameUpdate from "../NameUpdate"
import { useDisplay as useDisplaySecondScreen } from "../../../../../../components/SecondScreen/hookControls"
import { UserAvatar } from "../../../../../../components/Avatar"

const AccSetting = React.memo(function AccSetting() {
    const auth = getAuth()
    const user = auth.currentUser
    const fileInputRef = useRef()
    const addToast = useAddToast()
    const displaySecondScreen = useDisplaySecondScreen()

    const handleChooseImg = useCallback(() => {
        fileInputRef.current.click()
    }, [])

    const handlePhotoInputChange = useCallback(event => {
        const validImageTypes = ['image/jpeg', 'image/png']
        const file = event.target.files[0]
        if (validImageTypes.includes(file.type)) {
            const ComponentWillRender = () => <AvatarUpdate photo={file} />
            displaySecondScreen(ComponentWillRender)
        } else {
            addToast({
                id: uuidv4(),
                title: 'File không hợp lệ!',
                des: 'Hãy chọn ảnh có định dạng jpeg hoặc png.',
                type: 'error',
                time: 5000
            })
        }
        event.target.value = ''
    }, [])

    const handleUpdateUsername = useCallback(() => {
        displaySecondScreen(NameUpdate)
    }, [])

    return (
        <>
            <div className={style.photoURL}>
                <UserAvatar photoURL={user.photoURL} strAlt={user.displayName} />
                <div className={style.cam} onClick={handleChooseImg}>
                    <FontAwesomeIcon icon={faCamera} />
                </div>
                <input
                    ref={fileInputRef}
                    type='file'
                    style={{ display: 'none' }}
                    accept="image/jpeg, image/png"
                    onChange={handlePhotoInputChange}
                />
            </div>
            <div className={style.displayName}>
                <h5>{user.displayName}</h5>
                <div className={style.editName} onClick={handleUpdateUsername}>
                    <FontAwesomeIcon icon={faPencil} />
                </div>
            </div>
        </>
    )
})

export default AccSetting