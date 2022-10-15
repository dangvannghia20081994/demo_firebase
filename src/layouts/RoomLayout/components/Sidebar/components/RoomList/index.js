import React, { useCallback, useEffect, useRef, useState } from "react"
import { getAuth } from 'firebase/auth'
import { getDatabase, ref, onValue, query, orderByChild } from 'firebase/database'

import Room from "../Room"
import style from './RoomList.module.css'
import { FilterItem, FilterList } from "../../../../../../components/Filter"
import { useMakeHorizontalScroll } from '../../../../../../hooks/useMakeHorizontalScroll'

const RoomList = React.memo(function RoomList() {
    const auth = getAuth()
    const user = auth.currentUser
    const database = getDatabase()
    const roomFilterRef = useRef()

    const [roomList, setRoomList] = useState([])
    const [roomType, setRoomType] = useState('*')
    const [roomRemaining, setRoomRemaining] = useState([])

    useMakeHorizontalScroll(roomFilterRef)

    useEffect(() => {
        const roomListRef = query(ref(database, 'users/' + user.uid + '/chats'), orderByChild('lastMessage/timestamp'))
        const unsub = onValue(roomListRef, (snapshot) => {
            const rooms = []
            snapshot.forEach(room => { rooms.push(room.val()) })
            setRoomList(rooms.reverse())
        })

        return () => unsub()
    }, [])

    const handleSetRoomType = useCallback((roomType) => {
        setRoomType(roomType)
    }, [])

    useEffect(() => {
        let roomRemaining
        switch (roomType) {
            case '*':
                roomRemaining = roomList
                break

            case 'private':
                roomRemaining = roomList.filter(room => room.isGroup === false)
                break

            case 'group':
                roomRemaining = roomList.filter(room => room.isGroup === true)
                break
        }
        setRoomRemaining(roomRemaining)
    }, [roomType, roomList])

    return (
        <div className={style.roomList}>
            <div className={style.roomFilter} ref={roomFilterRef}>
                <FilterList>
                    <FilterItem
                        selected={Boolean(roomType === '*')}
                        onClick={() => handleSetRoomType('*')}
                    >Tất cả</FilterItem>
                    <FilterItem
                        selected={Boolean(roomType === 'private')}
                        onClick={() => handleSetRoomType('private')}
                    >Cá nhân</FilterItem>
                    <FilterItem
                        selected={Boolean(roomType === 'group')}
                        onClick={() => handleSetRoomType('group')}
                    >Nhóm</FilterItem>
                </FilterList>
            </div>
            <div className={style.rooms}>
                {
                    roomRemaining.map(room => <Room key={room.roomID} {...room} />)
                }
            </div>
        </div>
    )
})

export default RoomList