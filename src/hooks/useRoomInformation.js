import { useEffect, useState } from "react"
import { getDatabase, ref, onValue } from "firebase/database"

export function useRoomInformation({ roomID, isGroup, fUID }) {
    const database = getDatabase()
    const [roomInfo, setRoomInfo] = useState({})
    const [membersInGroup, setMembersInGroup] = useState([])

    useEffect(() => {
        if (isGroup) return

        const fUserRef = ref(database, 'users/' + fUID + '/information')
        const unsub = onValue(fUserRef, (snapshot) => setRoomInfo(snapshot.val()))

        return () => unsub()
    }, [isGroup,fUID])

    useEffect(() => {
        if (!isGroup) return

        const roomRef = ref(database, 'rooms/' + roomID + '/information')
        const unsub = onValue(
            roomRef,
            (snapshot) => snapshot.val() && setRoomInfo(snapshot.val())
        )

        return () => unsub()
    }, [roomID, isGroup])

    useEffect(() => {
        if (
            !isGroup ||
            roomInfo === undefined ||
            roomInfo.photoURL ||
            roomInfo.membersInfo
        ) return

        const membersRef = ref(database, 'rooms/' + roomID + '/information/members')
        const unsub = onValue(
            membersRef,
            (snapshot) => setMembersInGroup(Object.values(snapshot.val()))
        )

        return () => unsub()
    }, [roomInfo.photoURL, roomInfo.membersInfo, roomID, isGroup])

    useEffect(() => {
        let count = 0
        const memberRefArr = []

        for (let memberID of membersInGroup) {
            if (count >= 2) break
            count++

            const memberRef = ref(database, 'users/' + memberID + '/information')
            const unsub = onValue(
                memberRef,
                (snapshot) => setRoomInfo(prev => ({
                    ...prev,
                    membersInfo: {
                        ...prev.membersInfo,
                        [memberID]: snapshot.val()
                    }
                }))
            )

            memberRefArr.push(unsub)
        }

        return () => memberRefArr.forEach(unsub => unsub())
    }, [membersInGroup])

    return roomInfo
}