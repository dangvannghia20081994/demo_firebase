import React, { useCallback, useEffect, useRef } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from "clsx"
import {
    faCircleCheck,
    faTriangleExclamation,
    faXmark
} from '@fortawesome/free-solid-svg-icons'

import style from './Toast.module.css'
import { useRemove as useRemoveToast } from "../../hookControls"

const Toast = React.memo(function Toast({ id, title, des, type, time = 5000 }) {
    const toastRef = useRef()
    const countdownRef = useRef()
    const removeToast = useRemoveToast()

    const toastType = {
        'success': {
            icon: faCircleCheck,
            primaryColor: '#24ad2a'
        },
        'error': {
            icon: faTriangleExclamation,
            primaryColor: '#ff0000'
        }
    }

    useEffect(() => {
        countdownRef.current = setTimeout(handleHideToast, time + 500)
        return () => clearInterval(countdownRef.current)
    }, [])

    const handleHideToast = useCallback(() => {
        toastRef.current.classList.remove(style.active)
        toastRef.current.classList.add(style.inactive)
        setTimeout(() => {
            removeToast(id)
        }, 650)
    }, [])

    return (
        <div
            ref={toastRef} className={clsx(style.wrapper, style.active)}
            style={{ '--primaryColor': toastType[type].primaryColor, '--time': time / 1000 + 's' }}
        >
            <div className={style.toast}>
                <div className={style.icon}>
                    <FontAwesomeIcon icon={toastType[type].icon} />
                </div>
                <div className={style.message}>
                    <h3 className={style.title}>{title}</h3>
                    <p className={style.des}>{des}</p>
                </div>
                <div className={style.close} onClick={handleHideToast}>
                    <FontAwesomeIcon icon={faXmark} />
                </div>
            </div>
        </div>
    )
})

export default Toast