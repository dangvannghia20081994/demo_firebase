import React from "react"
import clsx from "clsx"
import style from './MessageSimulation.module.css'

const MessageSimulation = React.memo(function MessageSimulation() {
    return (
        <div className={style.wrapper}>
            <div className={style.messGroup}>
                <div className={style.noOwnership} style={{ width: '80%' }}></div>
                <div className={style.noOwnership} style={{ width: '30%' }}></div>
            </div>
            <div className={style.messGroup}>
                <div className={style.ownership} style={{ width: '50%' }}></div>
            </div>
            <div className={style.clear}></div>
            <div className={clsx(style.typing, style.messGroup)}>
                <div className={style.circle} style={{ '--i': 0 }}></div>
                <div className={style.circle} style={{ '--i': 1 }}></div>
                <div className={style.circle} style={{ '--i': 2 }}></div>
            </div>
        </div>
    )
})

export default MessageSimulation