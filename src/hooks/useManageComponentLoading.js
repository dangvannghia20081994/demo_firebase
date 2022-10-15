import { moduleLoadManager } from '../store/moduleLoadManager'
import {
    useStart as useStartProgressBar,
    useEnd as useEndProgressBar
} from '../components/ProgressBar/hookControls'

export default function useManageComponentLoading() {
    const startProgressBar = useStartProgressBar()
    const endProgressBar = useEndProgressBar()

    /**
     * @param [string] childrenPath - path to child component (ralative to /src directory)
     * @param [string] alias - corresponding name is used to detech if a module has been loaded
     *  */
    return async (childrenPath, alias, callback) => {
        let Module
        if (!moduleLoadManager[alias]) {
            startProgressBar()

            const moduleToLoad = await import('/src/' + childrenPath)
            Module = moduleToLoad.default

            endProgressBar()

            moduleLoadManager[alias] = true
        } else {
            const moduleToLoad = await import('/src/' + childrenPath)
            Module = moduleToLoad.default
        }

        typeof callback === 'function' && callback(Module)
    }
}