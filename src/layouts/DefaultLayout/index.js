import React from "react"

import SecondScreen from "../../components/SecondScreen"
import ProgressBar from "../../components/ProgressBar"
import Toasts from "../../components/Toasts"

import { useStoreContext } from '../../hooks/useStoreContext'

const DefaultLayout = React.memo(function DefaultLayout({ children }) {
    const { store } = useStoreContext()

    return (
        <>
            <Toasts />
            {store.progressBar.display &&
                <ProgressBar />}
            {store.secondScreen.display &&
                <SecondScreen>{store.secondScreen.children}</SecondScreen>}
            {children}
        </>
    )
})

export default DefaultLayout