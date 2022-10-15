import { useEffect } from "react"

export function useMakeHorizontalScroll(elementRef) {
    useEffect(() => {
        const element = elementRef.current
        const handleScroll = (event) => {
            event.preventDefault()
            element.scrollBy({
                left: event.deltaY > 0 ? 30 : -30
            })
        }
        element.addEventListener('wheel', handleScroll)

        return () => element.removeEventListener('wheel', handleScroll)
    }, [])
}