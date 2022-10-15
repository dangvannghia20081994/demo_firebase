import React, { useCallback } from "react"
import { getAuth, updateProfile } from "firebase/auth"
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getDatabase, ref as refDatabase, set } from "firebase/database"
import { v4 as uuidv4 } from "uuid"

import Modal_Box from "../../../../../../components/Modal_Box"
import { LightBtn, PrimaryBtn } from "../../../../../../components/Button"
import { useAdd as useAddToast } from "../../../../../../components/Toasts/hookControls"
import {
    useStart as useStartProgressBar,
    useEnd as useEndProgressBar
} from "../../../../../../components/ProgressBar/hookControls"
import Setting from "../.."
import { useDisplay as useDisplaySecondScreen } from "../../../../../../components/SecondScreen/hookControls"

import style from './AvatarUpdate.module.css'

const AvatarUpdate = React.memo(function AvatarUpdate({ photo }) {
    const auth = getAuth()
    const storage = getStorage()
    const user = auth.currentUser
    const previewURL = URL.createObjectURL(photo)
    const addToast = useAddToast()
    const startProgressBar = useStartProgressBar()
    const endProgressBar = useEndProgressBar()
    const displaySecondScreen = useDisplaySecondScreen()
    const database = getDatabase()

    const handleUpdateAvatar = useCallback(() => {
        const storageRef = ref(storage, 'avatars/' + user.uid)

        startProgressBar()

        uploadBytes(storageRef, photo)
            .then(({ ref }) => getDownloadURL(ref))
            .then((url) => {
                updateProfile(user, { photoURL: url })
                return url
            })
            .then((url) => {
                set(refDatabase(database, '/users/' + user.uid + '/information/photoURL'), url)
            })
            .then(() => addToast({
                id: uuidv4(),
                title: 'Tuyệt vời!',
                des: 'Ảnh đại diện đã được cập nhật.',
                type: 'success',
                time: 5000
            }))
            .then(handleCancel)
            .catch(() => addToast({
                id: uuidv4(),
                title: 'Không thành công!',
                des: 'Đã xảy ra lỗi! Vui lòng thử lại.',
                type: 'error', time: 5000
            }))
            .finally(endProgressBar)
    }, [])

    const handleCancel = useCallback(() => {
        displaySecondScreen(Setting)
    }, [])

    return (
        <Modal_Box title='Cập nhật ảnh đại diện'>
            <div className={style.photo}>
                <img src={previewURL} />
            </div>
            <div className={style.controls}>
                <PrimaryBtn title='Lưu' className={style.btn} onClick={handleUpdateAvatar} />
                <LightBtn title='Hủy' className={style.btn} onClick={handleCancel} />
            </div>
        </Modal_Box>
    )
})

export default AvatarUpdate