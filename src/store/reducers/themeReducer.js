const init = localStorage.getItem('theme') ?? 'light'

export function themeReducer(state = init, action = {}) {
    switch (action.type) {
        case 'theme.toggle':
            return (state === 'light' ? 'dark' : 'light')

        default:
            return state
    }
}