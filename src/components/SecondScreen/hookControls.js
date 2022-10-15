import { useCallback } from "react"
import { useStoreContext } from "../../hooks/useStoreContext"
import useManageComponentLoading from '../../hooks/useManageComponentLoading'

export function useDisplay() {
    const { storeDispatch } = useStoreContext()
    const manageComponentLoading = useManageComponentLoading()

    const addModuleToSecondScreen = useCallback(
        Module => storeDispatch({ type: 'secondScreen.on', payload: <Module /> })
        , [])

    return (childrenRef, alias) => {
        if (alias) {
            manageComponentLoading(childrenRef, alias, addModuleToSecondScreen)
        } else {
            addModuleToSecondScreen(childrenRef)
        }
    }
}

export function useHide() {
    const { storeDispatch } = useStoreContext()
    return () => storeDispatch({ type: 'secondScreen.off' })
}