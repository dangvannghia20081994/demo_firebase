import React, { useState, useCallback } from "react"
import { faUserGroup } from "@fortawesome/free-solid-svg-icons"
import { getDatabase, push, ref, update } from "firebase/database"
import { getAuth } from "firebase/auth"
import { useNavigate } from "react-router-dom"

import style from './GroupCreating.module.css'
import { InputWithValidation } from "../../../../components/Input"
import Modal_Box from "../../../../components/Modal_Box"
import { useHide as useHideSecondScreen } from "../../../../components/SecondScreen/hookControls"
import { LightBtn, PrimaryBtn } from "../../../../components/Button"

const GroupCreating = React.memo(function GroupCreating() {
    const database = getDatabase()
    const auth = getAuth()
    const user = auth.currentUser
    const navigate = useNavigate()
    const [info, setInfo] = useState({
        groupName: ''
    })

    const hideSecondScreen = useHideSecondScreen()

    const [isValid, setIsValid] = useState({
        groupName: false
    })

    const handleCreateNewGroup = useCallback(() => {
        if (!isValid.groupName) return

        const newRoom = push(ref(database, 'rooms'))
        const newRoomKey = newRoom.key
        const newRoomInfo = {
            members: {
                [user.uid]: user.uid,
            },
            name: info.groupName,
            photoURL: '',
            createdBy: user.uid
        }

        update(ref(database), {
            ['rooms/' + newRoomKey + '/information']: newRoomInfo,
            ['users/' + user.uid + '/chats/' + newRoomKey]: {
                isGroup: true,
                roomID: newRoomKey,
                lastMessage: {
                    message: user.displayName + " đã tạo nhóm",
                    sendBy: user.uid,
                    timestamp: Date.now()
                }
            },
            ['users/' + user.uid + '/groups/' + newRoomKey]: newRoomKey
        })
        .then(() => navigate('/room/' + newRoomKey))
        .then(hideSecondScreen)
    }, [info.groupName, isValid.groupName])

    const handleCancel = useCallback(() => {
        hideSecondScreen()
    }, [])

    return (
        <Modal_Box title='Tạo nhóm'>
            <InputWithValidation
                className={style.groupNameInput}
                icon={faUserGroup}
                data={info}
                setData={setInfo}
                dataType='groupName'
                setValidData={setIsValid}
                placeholder='Tên nhóm chat...'
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
                <PrimaryBtn title='Tạo nhóm' className={style.btn} onClick={handleCreateNewGroup} />
                <LightBtn title='Hủy' className={style.btn} onClick={handleCancel} />
            </div>
        </Modal_Box>
    )
})

export default GroupCreating