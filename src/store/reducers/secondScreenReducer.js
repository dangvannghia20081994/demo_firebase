const init = {
    display: false,
    children: null
}

export function secondScreenReducer(state = init, action = {}) {
    switch (action.type) {
        case 'secondScreen.on':
            return {
                children: action.payload,
                display: true
            }

        case 'secondScreen.off':
            return {
                children: null,
                display: false
            }

        default:
            return state
    }
}