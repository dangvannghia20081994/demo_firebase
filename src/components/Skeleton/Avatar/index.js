import React from "react"

import style from './Avatar.module.css'

const AvatarSkeleton = React.memo(function AvatarSkeleton() {
    return (
        <div className={style.avtSkeleton}></div>
    )
})

export default AvatarSkeleton