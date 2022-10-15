import React from "react"
import clsx from 'clsx'

import style from './Logo.module.css'

const Logo = React.memo(function Logo({ className }) {
    return <h1 className={clsx(style.logo, className)}>.Laughing</h1>
})

export default Logo