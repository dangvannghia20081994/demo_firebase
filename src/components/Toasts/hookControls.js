import { useContext } from "react"
import { StoreContext } from "../../context"

export function useAdd() {
    const { storeDispatch } = useContext(StoreContext)
    return toastData => storeDispatch({ type: 'toast.add', payload: toastData })
}

export function useRemove() {
    const { storeDispatch } = useContext(StoreContext)
    return toastId => storeDispatch({ type: 'toast.remove', payload: toastId })
}