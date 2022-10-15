import React from "react"
import clsx from "clsx"

import style from './Base.module.css'

export const Wrapper = React.memo(function Wrapper({ className, children }) {
    return (
        <div className={clsx(style.wrapper, className)}>
            {children}
        </div>
    )
})

export const Tooltip = React.memo(function Tooltip({ className, children }) {
    return (
        <div className={clsx(style.tooltip, className)}>
            {children}
        </div>
    )
})