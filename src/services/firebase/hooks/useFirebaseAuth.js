import { signInWithPopup } from 'firebase/auth'
import { v4 as uuidv4 } from 'uuid'
import { getDatabase, ref, update } from 'firebase/database'
import {
    getAuth,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithEmailAndPassword
} from 'firebase/auth'

import {
    useStart as useStartProgressBar,
    useEnd as useEndProgressBar
} from '../../../components/ProgressBar/hookControls'

import {
    useAdd as useAddToast
} from '../../../components/Toasts/hookControls'

import {
    useHide as useHideSecondScree
} from '../../../components/SecondScreen/hookControls'

export function useFirebaseAuth() {
    const auth = getAuth()
    const startProgressBar = useStartProgressBar()
    const endProgressBar = useEndProgressBar()
    const addToast = useAddToast()
    const hideSecondScreen = useHideSecondScree()
    const database = getDatabase()

    const loginFail = function (error) {
        console.error(error.code, error.message)
        let errMess
        switch (error.code) {
            case 'auth/internal-error':
                errMess = 'Thông tin đăng nhập không chính xác.'
                break

            case 'auth/user-not-found':
                errMess = 'Tài khoản không tồn tại.'
                break

            case 'auth/cancelled-popup-request':
            case 'auth/popup-closed-by-user':
                errMess = 'Cửa sổ đăng nhập bị đóng bất ngờ.'
                break

            case 'auth/wrong-password':
                errMess = 'Mật khẩu không chính xác.'
                break

            case 'auth/too-many-requests':
                errMess = 'Tài khoản tạm thời bị vô hiệu hóa do nhiều lần đăng nhập không thành công.'
                break

            default:
                errMess = 'Vui lòng kiểm tra kết nối và thử lại.'
                break
        }

        addToast({ id: uuidv4(), title: 'Oops! Có gì đó không ổn', des: errMess, type: 'error', time: 5000 })
    }

    const final = function () {
        endProgressBar()
    }

    return function (platform = 'origin', payload) {
        startProgressBar()

        if (platform === 'facebook' || platform === 'google') {
            const provider = platform === 'facebook' ?
                new FacebookAuthProvider() :
                new GoogleAuthProvider()

            signInWithPopup(auth, provider)
                .then(userCredential => {
                    const user = userCredential.user
                    update(ref(database), {
                        ['users/' + user.uid + '/information/name']: user.displayName,
                        ['users/' + user.uid + '/information/email']: user.email,
                        ['users/' + user.uid + '/information/uid']: user.uid,
                        ['users/' + user.uid + '/information/photoURL']: user.photoURL,
                    })
                })
                .catch(loginFail)
                .finally(final)
        } else if (platform === 'origin') {
            signInWithEmailAndPassword(auth, payload?.email, payload?.password)
                .then(hideSecondScreen)
                .catch(loginFail)
                .finally(final)
        }
    }
}