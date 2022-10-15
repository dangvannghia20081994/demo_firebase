import React, { useCallback } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import Modal from "../Modal"
import { useHide as useHideSecondScreen } from "../SecondScreen/hookControls"
import style from './Modal_Box.module.css'

const Modal_Box = React.memo(function Modal_Box({ title, children, callbackWhenClickClose }) {
    const hideSecondScreen = useHideSecondScreen()

    const handleCloseBtnClick = useCallback(() => {
        hideSecondScreen();
        (typeof callbackWhenClickClose === 'function') &&
            callbackWhenClickClose()
    }, [])

    return (
        <div className={style.wrapper}>
            <Modal className={style.modal}>
                <div className={style.header}>
                    <h3 className={style.title}>{title}</h3>
                    <button className={style.close} onClick={handleCloseBtnClick}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>
                <div className={style.body}>
                    {children}
                </div>
            </Modal>
        </div>
    )
})

export default Modal_Box