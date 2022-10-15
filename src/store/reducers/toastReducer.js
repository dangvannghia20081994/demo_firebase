const init = []

export function toastReducer(state = init, action = {}) {
    switch (action.type) {
        case 'toast.add':
            return [
                ...state,
                action.payload
            ]

        case 'toast.remove':
            return state.filter(toast => toast.id != action.payload)

        default:
            return state
    }
}