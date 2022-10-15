import { useState, useEffect } from "react"
import { getDatabase, ref, onValue } from "firebase/database"

export function useFriendStatus(userID) {
    const [isOnline, setIsOnline] = useState()
    const database = getDatabase()

    useEffect(() => {
        const userConnectionRef = ref(database, 'users/' + userID + '/connections')
        const unsubscribe = onValue(userConnectionRef, (snapshot) => {
            snapshot.val() === null ? setIsOnline(false) : setIsOnline(true)
        })

        return () => unsubscribe()
    }, [])

    return isOnline
}