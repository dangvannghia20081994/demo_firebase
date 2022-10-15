import React from "react"
import clsx from "clsx"

import style from './CircleCheckbox.module.css'

const CirlceCheckbox = React.memo(function CirlceCheckbox({ checked, className }) {
    return (
        <div className={clsx(style.circleCheckbox, className)}>
            <div className={clsx(style.mask, checked && style.checked)}></div>
            <input type='checkbox' onChange={() => {}} checked={checked} style={{display: 'none'}} />
        </div>
    )
})

export default CirlceCheckbox