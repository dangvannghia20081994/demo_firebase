import React from "react"
import { Tooltip, Wrapper } from "../../Base"
import style from './TooltipMessageInteractive.module.css'

const TooltipMessageInteractive = React.memo(function TooltipMessageInteractive({ children }) {
    return (
        <Wrapper className={style.wrapper}>
            <Tooltip className={style.tooltip}>
                {children}
            </Tooltip>
        </Wrapper>
    )
})

export default TooltipMessageInteractive