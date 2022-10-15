import React from "react"
import clsx from "clsx"

import style from './SecondScreen.module.css'

import { useStoreContext } from "../../hooks/useStoreContext"

const SecondScreen = React.memo(function SecondScreen({ className }) {
    const { store } = useStoreContext()

    return (
        <div className={clsx(style.secondScreen, className)} id='2nd__screen'>
            {store.secondScreen.children}
        </div>
    )
})

export default SecondScreen