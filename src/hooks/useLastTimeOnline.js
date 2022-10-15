import { useState, useEffect } from "react"
import { getDatabase, onValue, ref } from "firebase/database"

import { getTimeLine } from "../utils/timeConversion"


export function useLastTimeOnline(userID) {
    const database = getDatabase()
    const lastOnlineRef = ref(database, 'users/' + userID + '/lastOnline')
    const [lastTimeOnline, setLastTimeOnline] = useState()
    const [timeline, setTimeline] = useState()

    useEffect(() => {
        const unsubscribe = onValue(lastOnlineRef, (snapshot) => {
            setLastTimeOnline(snapshot.val())
            setTimeline(getTimeLine(snapshot.val(), 'offline'))
        })

        return () => unsubscribe()
    }, [])

    useEffect(() => {
        const timer = setInterval(() => setTimeline(getTimeLine(lastTimeOnline, 'offline')), 30e3)

        return () => clearInterval(timer)
    }, [lastTimeOnline])

    return { timeline, lastTimeOnline }
}