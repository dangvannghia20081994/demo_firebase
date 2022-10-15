import React from "react"
import style from './DefaultAvatar.module.css'
import clsx from "clsx"

const DefaultAvatar = React.memo(function DefaultAvatar({ strToAvt, className }) {
    return (
        <div className={clsx(style.defaultAvt, className)}>
            <p>{strToAvt && strToAvt[0].toUpperCase()}</p>
        </div>
    )
})

export default DefaultAvatar