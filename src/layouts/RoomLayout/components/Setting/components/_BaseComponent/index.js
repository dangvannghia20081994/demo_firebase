import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import style from './_BaseComponent.module.css'
import { ToggleCheckbox } from "../../../../../../components/Input"

export const SettingGroup = React.memo(function SettingGroup({ title, children }) {
    return (
        <div className={style.settingGr}>
            <h4 className={style.title}>{title}</h4>
            <div className={style.main}>
                {children}
            </div>
        </div>
    )
})

export const ToggleType = React.memo(function ToggleType({ icon, title, checked, toggleHandler }) {
    return (
        <div className={style.wrapper}>
            <div className={style.setting}>
                <div className={style.icon}>
                    <FontAwesomeIcon icon={icon} />
                </div>
                <h5 className={style.title}>{title}</h5>
            </div>
            <div>
                <ToggleCheckbox checked={checked} toggleHandler={toggleHandler} />
            </div>
        </div>
    )
})