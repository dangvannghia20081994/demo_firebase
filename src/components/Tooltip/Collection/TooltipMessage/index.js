import React from "react"
import { Tooltip, Wrapper } from "../../Base"
import style from './TooltipMessage.module.css'

const TooltipMessage = React.memo(function TooltipMessage({ children }) {
    return (
        <Wrapper className={style.wrapper}>
            <Tooltip className={style.tooltip}>
                {children}
            </Tooltip>
        </Wrapper>
    )
})

export default TooltipMessage