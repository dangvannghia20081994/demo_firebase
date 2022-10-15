import React from "react"
import clsx from "clsx"

import style from './Modal.module.css'

const Modal = React.memo(function Modal({ className, children }) {
    return (
        <div className={clsx(style.modal, className)}>
            {children}
        </div>
    )
})

export default Modal