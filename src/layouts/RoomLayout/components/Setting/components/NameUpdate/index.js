import React, { useCallback, useState } from "react"
import { faUserAstronaut } from "@fortawesome/free-solid-svg-icons"
import { getAuth, updateProfile } from "firebase/auth"
import { getDatabase, ref, set } from 'firebase/database'
import { v4 as uuidv4 } from "uuid"

import Modal_Box from "../../../../../../components/Modal_Box"
import { InputWithValidation } from "../../../../../../components/Input"
import {
    useStart as useStartProgressBar,
    useEnd as useEndProgressBar
} from "../../../../../../components/ProgressBar/hookControls"
import { useAdd as useAddToast } from "../../../../../../components/Toasts/hookControls"
import { useDisplay as useDisplaySecondScreen } from "../../../../../../components/SecondScreen/hookControls"
import Setting from "../.."
import { LightBtn, PrimaryBtn } from "../../../../../../components/Button"

import style from './NameUpdate.module.css'

const NameUpdate = React.memo(function NameUpdate() {
    const auth = getAuth()
    const user = auth.currentUser
    const startProgressBar = useStartProgressBar()
    const endProgressBar = useEndProgressBar()
    const addToast = useAddToast()
    const displaySecondScreen = useDisplaySecondScreen()

    const [info, setInfo] = useState({
        username: ''
    })

    const [isValid, setIsValid] = useState({
        username: false
    })

    const handleNameUpdate = useCallback(() => {
        if (Object.values(isValid).some(status => status === false)) return

        startProgressBar()
        updateProfile(user, { displayName: info.username })
            .then(() => addToast({
                id: uuidv4(),
                title: 'Tuyệt vời!',
                des: 'Mọi thứ đều đúng theo ý muốn của bạn.',
                type: 'success',
                time: 5000
            }))
            .then(() => {
                const db = getDatabase()
                set(ref(db, 'users/' + user.uid + '/information/name'), info.username)
            })
            .then(handleCancel)
            .catch(() => addToast({
                id: uuidv4(),
                title: 'Không thành công!',
                des: 'Đã xảy ra lỗi! Vui lòng thử lại.',
                type: 'error', time: 5000
            }))
            .finally(endProgressBar)

    }, [JSON.stringify(info), JSON.stringify(isValid)])

    const handleCancel = useCallback(() => {
        displaySecondScreen(Setting)
    }, [])

    return (
        <Modal_Box title='Chỉnh sửa tên người dùng'>
            <InputWithValidation
                className={style.nameInput}
                icon={faUserAstronaut}
                data={info}
                setData={setInfo}
                dataType='username'
                setValidData={setIsValid}
                placeholder={user.displayName}
                rules={{
                    length: {
                        rule: { min: 2, max: 98 },
                        errMessage: `Tên nhóm phải từ 2 - 98 ký tự.`
                    },
                    startOrEndWithSpace: {
                        errMessage: 'Tên nhóm không được xuất hiện ký tự khoảng trắng ở đầu hoặc cuối.'
                    }
                }}
            />
            <div className={style.controls}>
                <PrimaryBtn title='Lưu' className={style.btn} onClick={handleNameUpdate} />
                <LightBtn title='Hủy' className={style.btn} onClick={handleCancel} />
            </div>
        </Modal_Box>
    )
})

export default NameUpdate