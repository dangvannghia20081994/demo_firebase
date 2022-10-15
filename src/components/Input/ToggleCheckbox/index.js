import React from "react"
import clsx from "clsx"

import style from './ToggleCheckbox.module.css'

const ToggleCheckbox = React.memo(function ToggleCheckbox({ checked, toggleHandler }) {
    return (
        <div className={style.toggleCheckbox}>
            <label className={clsx(style.toggle, checked && style.active)} onClick={toggleHandler} />
            <input type='checkbox' checked={checked} style={{ display: 'none' }} onChange={() => { }} />
        </div>
    )
})

export default ToggleCheckbox