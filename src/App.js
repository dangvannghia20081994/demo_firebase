import { useEffect, Fragment, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from "firebase/auth"

import './assets/css/global.css'

import { publicRoutes, privateRoutes } from './routers'
import { firebaseApp } from './services/firebase/setup'

import { useStoreReducer } from './store/reducers'
import { StoreContext } from './context'

import { NoAuthRequired } from './middlewares/NoAuthRequired'
import { AuthRequired } from './middlewares/AuthRequired'

import DefaultLayout from './layouts/DefaultLayout'

function App() {
    const [store, storeDispatch] = useStoreReducer()
    const [auth, setAuth] = useState(null)

    const firebaseAuth = getAuth()

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', store.theme)
    }, [store.theme])

    useEffect(() => {
        onAuthStateChanged(firebaseAuth, user => user ? setAuth(true) : setAuth(false))
    }, [])

    return (
        <StoreContext.Provider value={{ store, storeDispatch }}>
            <Router>
                <Routes>
                    <Route path='/' element={<NoAuthRequired auth={auth} />}>
                        {publicRoutes.map((route, index) => {
                            const Component = route.component ?? (() => <></>)
                            const Layout = route.layout === null ? Fragment :
                                route.layout ? route.layout : DefaultLayout

                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={<Layout><Component /></Layout>}
                                />
                            )
                        })}
                    </Route>
                    <Route path='/' element={<AuthRequired auth={auth} />}>
                        {privateRoutes.map((route, index) => {
                            const Component = route.component ?? (() => <></>)
                            const Layout = route.layout === null ? Fragment :
                                route.layout ? route.layout : DefaultLayout

                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={<Layout><Component /></Layout>}
                                />
                            )
                        })}
                    </Route>
                </Routes>
            </Router>
        </StoreContext.Provider>
    )
}

export default App
