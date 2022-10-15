import React, { useState, useCallback } from "react"
import {
    faCircleUser,
    faAt,
    faLock
} from '@fortawesome/free-solid-svg-icons'

import Form from "../Form"
import {
    useCreateUserWithEmailAndPass
} from "../../../../services/firebase/hooks/useCreateUserWithEmailAndPass"

const FormSignUp = React.memo(function FormSignUp() {
    const createUserWithEmailAndPassword = useCreateUserWithEmailAndPass()

    const [info, setInfo] = useState({
        username: '',
        email: '',
        password: '',
        repassword: ''
    })

    const [isValid, setIsValid] = useState({
        username: false,
        email: false,
        password: false,
        repassword: false
    })

    const fieldData = [
        {
            type: 'text',
            icon: faCircleUser,
            placeholder: 'Tên tài khoản',
            dataType: 'username',
            rules: {
                specialCharacters: {
                    errMessage: 'Tên người dùng không được bao gồm các ký tự đặc biệt: \[\]\{\}+=~!@#$%^&*()|\\.,;:\'"~`\-\_/.'
                },
                length: {
                    rule: { min: 2, max: 98 },
                    errMessage: `Tên người dùng phải từ 2 - 98 ký tự.`
                },
                startOrEndWithSpace: {
                    errMessage: 'Tên người dùng không được xuất hiện ký tự khoảng trắng ở đầu hoặc cuối.'
                }
            }
        },
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
        },
        {
            type: 'password',
            icon: faLock,
            placeholder: 'Nhập lại mật khẩu',
            dataType: 'repassword',
            rules: {
                length: {
                    rule: { min: 6, max: 1e10 },
                    errMessage: `Mật khẩu yêu cầu tối thiểu 6 ký tự.`
                },
                sameWith: {
                    rule: info.password,
                    errMessage: 'Mật khẩu không khớp.'
                }
            }
        }
    ]

    const action = useCallback(() => {
        Object.values(isValid).some(status => status === false) ||
        createUserWithEmailAndPassword(info)
    }, [JSON.stringify(isValid), JSON.stringify(info)])

    return (
        <Form
            info={info}
            setInfo={setInfo}
            isValid={isValid}
            setIsValid={setIsValid}
            title='Tạo tài khoản'
            fieldData={fieldData}
            action={action}
        />
    )
})

export default FormSignUp