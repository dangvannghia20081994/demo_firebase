const init = {
    display: false,
    success: false
}

export function progressBarReducer(state = init, action = {}) {
    switch (action.type) {
        case 'progressBar.display':
            return {
                ...state,
                display: action.payload
            }

        case 'progressBar.success':
            return {
                ...state,
                success: action.payload
            }

        default:
            return state
    }
}