import { v4 as uuidv4 } from 'uuid'
import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile
} from "firebase/auth"
import { getDatabase, ref, set } from 'firebase/database'

import {
    useAdd as useAddToast
} from '../../../components/Toasts/hookControls'

import {
    useStart as useStartProgressBar,
    useEnd as useEndProgressBar
} from '../../../components/ProgressBar/hookControls'

import {
    useHide as useHideSecondScreen
} from '../../../components/SecondScreen/hookControls'

export function useCreateUserWithEmailAndPass() {
    const auth = getAuth()
    const startProgressBar = useStartProgressBar()
    const endProgressBar = useEndProgressBar()
    const addToast = useAddToast()
    const hideSecondScreen = useHideSecondScreen()
    const database = getDatabase()

    return function ({ username, email, password }) {
        startProgressBar()

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user

                sessionStorage.setItem('createUserWithEmailAndPassword.username', username)
                updateProfile(auth.currentUser, {
                    displayName: username
                })

                const userInfoRef = ref(database, 'users/' + user.uid + '/information/')
                set(userInfoRef, {
                    name: username,
                    email,
                    uid: user.uid
                })
                
            })
            .then(hideSecondScreen)
            .catch(err => {
                console.error(err.code, err.message)
                let errMess

                switch (err.code) {
                    case 'auth/email-already-in-use':
                        errMess = 'Email đã được đăng ký trước đó.'
                        break
                }

                addToast({
                    id: uuidv4(),
                    title: 'Oops! Có gì đó không ổn',
                    des: errMess,
                    type: 'error',
                    time: 5000
                })
            })
            .finally(endProgressBar)
    }
}