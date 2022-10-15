import React from "react"
import clsx from "clsx"
import style from './AdvanceBtn.module.css'

export const AdvanceBtn = React.memo(function AdvanceBtn({ image, title, className, ...props }) {
    return (
        <button className={clsx(style.btn, className)} {...props}>
            {image && <img className={style.img} src={image} />}
            <p className={style.title}>{title}</p>
        </button>
    )
})