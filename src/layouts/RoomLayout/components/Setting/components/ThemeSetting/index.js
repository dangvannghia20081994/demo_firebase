import React, { useCallback, useContext } from "react"
import { faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons'

import { ToggleType } from "../_BaseComponent"
import { StoreContext } from '../../../../../../context'

const ThemeSetting = React.memo(function ThemeSetting() {
    const { store, storeDispatch } = useContext(StoreContext)

    const handleThemeToggle = useCallback(() => {
        localStorage.setItem('theme', store.theme === 'light' ? 'dark' : 'light')
        storeDispatch({ type: 'theme.toggle' })
    }, [store.theme])

    return (
        <ToggleType
            icon={faCircleHalfStroke}
            title='Giao diện tối'
            checked={Boolean(store.theme === 'dark')}
            toggleHandler={handleThemeToggle}
        />
    )
})

export default ThemeSetting