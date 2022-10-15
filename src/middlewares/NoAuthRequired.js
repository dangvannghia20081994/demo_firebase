import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"

export function NoAuthRequired({ auth }) {
    const navigate = useNavigate()

    useEffect(() => {
        auth && navigate('/room')
    })

    return auth === null || auth || <Outlet />
}