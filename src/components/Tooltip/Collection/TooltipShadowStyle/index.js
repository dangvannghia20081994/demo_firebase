import React from "react"

import { Wrapper, Tooltip } from "../../Base"
import style from './TooltipShadowStyle.module.css'

const TooltipShadowStyle = React.memo(function TooltipShadowStyle({ children }) {
    return (
        <Wrapper className={style.wrapper}>
            <Tooltip className={style.tooltip}>
                {children}
            </Tooltip>
        </Wrapper>
    )
})

export default TooltipShadowStyle