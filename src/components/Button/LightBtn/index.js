import React from "react"
import clsx from "clsx"
import style from './LightBtn.module.css'

export const LightBtn = React.memo(function LightBtn({ title, className, ...props }) {
    return (
        <button className={clsx(style.btn, className)} {...props}>
            {title}
        </button>
    )
})