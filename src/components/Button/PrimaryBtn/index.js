import React from "react"
import clsx from "clsx"
import style from './PrimaryBtn.module.css'

export const PrimaryBtn = React.memo(function PrimaryBtn({ title, className, ...props }) {
    return (
        <button className={clsx(style.btn, className)} {...props}>
            {title}
        </button>
    )
})