import React, { useCallback, useState } from "react"
import {
    faAt,
    faLock
} from '@fortawesome/free-solid-svg-icons'

import Form from "../Form"
import { useFirebaseAuth } from "../../../../services/firebase/hooks/useFirebaseAuth"

const FormLogin = React.memo(function FormLogin() {
    const firebaseAuth = useFirebaseAuth()

    const [info, setInfo] = useState({
        email: '',
        password: ''
    })

    const [isValid, setIsValid] = useState({
        email: false,
        password: false
    })

    const fieldData = [
        {
            type: 'text',
            icon: faAt,
            placeholder: 'Email',
            dataType: 'email',
            rules: {
                email: {}
            }
        },
        {
            type: 'password',
            icon: faLock,
            placeholder: 'Mật khẩu',
            dataType: 'password',
            rules: {
                length: {
                    rule: { min: 6, max: 1e10 },
                    errMessage: `Mật khẩu yêu cầu tối thiểu 6 ký tự.`
                }
            }
        }
    ]

    const action = useCallback(() => {
        Object.values(isValid).some(status => status === false) ||
        firebaseAuth('origin', info)
    }, [JSON.stringify(isValid), JSON.stringify(info)])

    return (
        <Form
            info={info}
            setInfo={setInfo}
            isValid={isValid}
            setIsValid={setIsValid}
            title='Đăng nhập'
            fieldData={fieldData}
            action={action}
        />
    )
})

export default FormLogin