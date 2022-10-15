import React, { useCallback, useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faCircleCheck,
    faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons'
import clsx from "clsx"

import style from './InputWithValidation.module.css'

import { TooltipMessage } from "../../Tooltip"

import { validate } from "../../../utils/inputValidation"

const InputWithValidation = React.memo(
    function InputWithValidation(
        { icon, className, data, setData, dataType, rules, setValidData, ...props }
    ) {
        const [isInteracted, setIsInteracted] = useState(false)
        const [isFocus, setIsFocus] = useState(false)
        const [errs, setErrs] = useState([])

        const handleOnChange = useCallback(() => {
            setIsInteracted(true)
        }, [])

        const handleOnInput = useCallback((e) => {
            const inputVal = e.target.value
            setData(prev => ({
                ...prev,
                [dataType]: inputVal
            }))
        }, [])

        useEffect(() => {
            const validationResult = validate(data[dataType], rules)
            setErrs(validationResult)
            setValidData(prev => ({
                ...prev,
                [dataType]: !(validationResult.length > 0)
            }))
        }, [JSON.stringify(data), JSON.stringify(rules)])

        return (
            <div className={clsx(style.wrapper, className)}>
                <label className={style.label}>
                    <FontAwesomeIcon icon={icon} />
                </label>
                <input
                    className={style.input}
                    value={data[dataType]}
                    onChange={handleOnChange}
                    onInput={handleOnInput}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    {...props}
                />
                {isInteracted &&
                    <span className={errs.length > 0 ? style.errStt : style.succStt}>
                        <FontAwesomeIcon
                            icon={errs.length > 0 ? faTriangleExclamation : faCircleCheck}
                        />
                    </span>}
                {isInteracted && isFocus && errs.length > 0 &&
                    <TooltipMessage>
                        {errs.map((err, index) => <p key={index} className={style.err}>{err.message}</p>)}
                    </TooltipMessage>}
            </div>
        )
    },
    function (prevProps, nextProps) {
        return JSON.stringify(prevProps.data[prevProps.dataType]) == JSON.stringify(nextProps.data[nextProps.dataType]) &&
            JSON.stringify(prevProps.rules) == JSON.stringify(nextProps.rules) &&
            prevProps.placeholder == nextProps.placeholder
    }
)

export default InputWithValidation