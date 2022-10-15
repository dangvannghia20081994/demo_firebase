import { useCallback, useEffect } from "react"

export const useHideClickOutside = function (containerRef, hiddenHandling) {
    const handleClick = useCallback(event => {
        if (!containerRef.current.contains(event.target)) {
            hiddenHandling()
        }
    }, [])

    useEffect(() => {
        document.getElementById('root').addEventListener('click', handleClick)

        return () => document.getElementById('root')
            .removeEventListener('click', handleClick)
    }, [])
}