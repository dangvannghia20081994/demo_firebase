import { useContext } from "react"
import { StoreContext } from "../context"

export function useStoreContext() {
    return useContext(StoreContext)
}