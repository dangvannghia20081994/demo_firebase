import React from "react"

import Modal_Box from "../../../../components/Modal_Box"
import AccSetting from "./components/AccSetting"
import ThemeSetting from "./components/ThemeSetting"
import { SettingGroup } from "./components/_BaseComponent"

const Settings = React.memo(function Settings() {
    return (
        <Modal_Box title='Tùy chọn'>
            <SettingGroup title='Tài khoản'>
                <AccSetting />
            </SettingGroup>
            <SettingGroup title='Ứng dụng'>
                <ThemeSetting />
            </SettingGroup>
        </Modal_Box>
    )
})

export default Settings