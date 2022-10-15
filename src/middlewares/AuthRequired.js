import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"

export function AuthRequired({ auth }) {
    const navigate = useNavigate()

    useEffect(() => {
        auth === null || auth || navigate('/')
    })

    return auth && <Outlet />
}