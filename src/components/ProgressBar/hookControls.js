import { useContext } from 'react'
import { StoreContext } from '../../context'

export function useStart() {
    const { storeDispatch } = useContext(StoreContext)
    return () => storeDispatch({ type: 'progressBar.display', payload: true })
}

export function useEnd() {
    const { storeDispatch } = useContext(StoreContext)
    return () => storeDispatch({ type: 'progressBar.success', payload: true })
}