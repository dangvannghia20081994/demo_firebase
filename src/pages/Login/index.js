import React, { useCallback } from 'react'
import clsx from 'clsx'

import style from './Login.module.css'

import Logo from '../../components/Logo'
import MessageSimulation from './components/MessageSimulation'
import { AdvanceBtn } from '../../components/Button'
import { useDisplay as useDisplaySecondScreen } from '../../components/SecondScreen/hookControls'

import { useFirebaseAuth } from '../../services/firebase/hooks/useFirebaseAuth'

import facebookImg from '../../assets/imgs/facebook.svg'
import googleImg from '../../assets/imgs/google.svg'



const Login = React.memo(function Login() {
    const displaySecondScreen = useDisplaySecondScreen()
    const firebaseAuth = useFirebaseAuth()

    const handleLogin = useCallback(() => {
        displaySecondScreen('pages/Login/components/LoginForm', 'LoginForm')
    }, [])

    const handleSignup = useCallback(() => {
        displaySecondScreen('pages/Login/components/SignupForm', 'SignupForm')
    }, [])

    return (
        <div className={style.wrapper}>
            <Logo className={style.logo} />
            <MessageSimulation />
            <div className={style.loginMethods}>
                <AdvanceBtn
                    title='Đăng nhập'
                    className={clsx(style.originPlatform, style.loginMethod)}
                    onClick={handleLogin}
                />
                <AdvanceBtn
                    image={facebookImg}
                    className={style.loginMethod} title='Đăng nhập với Facebook'
                    onClick={() => firebaseAuth('facebook')}
                />
                <AdvanceBtn
                    image={googleImg}
                    className={style.loginMethod}
                    title='Đăng nhập với Google'
                    onClick={() => firebaseAuth('google')}
                />
            </div>
            <p className={style.text}>Bạn không có tài khoản?
                <span
                    className={clsx(style.link, style.register)}
                    onClick={handleSignup}
                >
                    Đăng ký
                </span>
            </p>
        </div>
    )
})

export default Login