import React from "react"

import style from './Toasts.module.css'

import Toast from "./components/Toast"
import { useStoreContext } from "../../hooks/useStoreContext"

const Toasts = React.memo(function Toasts() {
    const { store } = useStoreContext()

    return (
        <div className={style.toasts}>
            {store.toast.map(toast => (
                <Toast
                    key={toast.id}
                    id={toast.id}
                    title={toast.title}
                    des={toast.des}
                    type={toast.type}
                    time={toast.time}
                />
            ))}
        </div>
    )
})

export default Toasts