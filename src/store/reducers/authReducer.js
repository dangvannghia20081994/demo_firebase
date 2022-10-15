const init = null

export function authReducer(state = init, action = {}) {
    switch (action.type) {
        case 'auth.update':
            return action.payload

        default:
            return state
    }
}