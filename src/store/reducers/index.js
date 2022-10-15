import { useReducer } from "react"

import { authReducer } from './authReducer'
import { themeReducer } from "./themeReducer"
import { secondScreenReducer } from "./secondScreenReducer"
import { progressBarReducer } from "./progressBarReducer"
import { toastReducer } from "./toastReducer"

function rootReducer(state, action) {
    return {
        auth: authReducer(state?.auth, action),
        theme: themeReducer(state?.theme, action),
        secondScreen: secondScreenReducer(state?.secondScreen, action),
        progressBar: progressBarReducer(state?.progressBar, action),
        toast: toastReducer(state?.toast, action)
    }
}

export function useStoreReducer() {
    return useReducer(rootReducer, null, rootReducer)
}