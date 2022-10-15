import React, { useState } from "react"
import clsx from "clsx"

import style from './Form.module.css'

import Modal_Form from "../../../../components/Modal_Form"
import { InputWithValidation } from "../../../../components/Input"
import { AdvanceBtn } from "../../../../components/Button"

const Form = React.memo(function Form({ title, fieldData, info, setInfo, isValid, setIsValid, action }) {
    return (
        <div className={style.wrapper}>
            <Modal_Form title={title}>
                {fieldData.map((field, index) => (
                    <InputWithValidation key={index}
                        type={field.type}
                        className={clsx(style.field)}
                        icon={field.icon}
                        placeholder={field.placeholder}
                        data={info}
                        setData={setInfo}
                        dataType={field.dataType}
                        rules={field.rules}
                        setValidData={setIsValid}
                    />))}
                <AdvanceBtn
                    className={
                        clsx(
                            style.btn,
                            style.field,
                            Object.values(isValid).some(status => status === false) || style.btnActive
                        )
                    }
                    title='Tiếp tục'
                    onClick={action}
                />
            </Modal_Form>
        </div>
    )
})

export default Form