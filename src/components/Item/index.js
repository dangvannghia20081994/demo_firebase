import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import clsx from "clsx"

import style from "./Item.module.css"

const Item = React.memo(function Item({ icon, title, className, onClick }) {
    return (
        <div onClick={onClick} className={clsx(style.item, className)}>
            <div className={style.icon}>
                <FontAwesomeIcon icon={icon} className={style.awesomIco} />
            </div>
            <h3 className={style.title}>{title}</h3>
        </div>
    )
})

export default Item