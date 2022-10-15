import React, { useCallback } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faXmark
} from '@fortawesome/free-solid-svg-icons'

import Modal from "../Modal"

import style from './Modal_Form.module.css'

import { useHide as useHideSecondScreen } from "../SecondScreen/hookControls"

const Modal_Form = React.memo(function Modal_Form({ title, children }) {
    const hideSecondScreen = useHideSecondScreen()

    const hanldeHideModal_Form = useCallback(() =>{
        hideSecondScreen()
    }, [])

    return (
        <Modal className={style.form}>
            <div className={style.header}>
                <h3 className={style.title}>{title}</h3>
                <button className={style.close} onClick={hanldeHideModal_Form}>
                    <FontAwesomeIcon icon={faXmark} />
                </button>
            </div>
            <div className={style.body}>
                {children}
            </div>
        </Modal>
    )
})

export default Modal_Form