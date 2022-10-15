import React from "react"
import clsx from "clsx"

import style from './Filter.module.css'

export const FilterList = React.memo(function FilterList({ children, className, ...restProps }) {
    return (
        <ul className={clsx(style.filterList, className)} {...restProps}>
            {children}
        </ul>
    )
})

export const FilterItem = React.memo(function FilterItem({ children, className, ...restProps }) {
    return (
        <li
            className={
                clsx(
                    style.filterItem,
                    className,
                    restProps.selected && style.selected
                )
            }
            {...restProps}>
            {children}
        </li>
    )
})