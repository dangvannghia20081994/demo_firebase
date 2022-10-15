import React, { useContext, useEffect, useRef, useState } from "react"

import style from './ProgressBar.module.css'

import { StoreContext } from "../../context"

const ProgressBar = React.memo(function ProgressBar() {
    const [percent, setPercent] = useState(0)
    const runner = useRef()
    const progressBarElm = useRef()
    const { store, storeDispatch } = useContext(StoreContext)

    useEffect(() => {
        runner.current = setInterval(() => {
            setPercent(prev => {
                if (prev >= 69) {
                    clearInterval(runner.current)
                }
                return prev + .25
            }, 5)
        })
    }, [])

    useEffect(() => {
        if (!store.progressBar.display || !store.progressBar.success) return

        clearInterval(runner.current)
        progressBarElm.current.classList.add(style.dur)
        setPercent(100)

        setTimeout(() => {
            storeDispatch({ type: 'progressBar.display', payload: false })
            storeDispatch({ type: 'progressBar.success', payload: false })
        }, 500)
    }, [store.progressBar.success])

    return (
        <div ref={progressBarElm} className={style.progress} style={{ width: `${percent}%` }} />
    )
})

export default ProgressBar