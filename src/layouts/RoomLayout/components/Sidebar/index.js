import React, { useCallback, useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faPlus,
    faMagnifyingGlass,
    faArrowLeft
} from '@fortawesome/free-solid-svg-icons'
import { getAuth } from "firebase/auth"
import { getDatabase, onValue, ref } from "firebase/database"
import clsx from "clsx"

import style from './Sidebar.module.css'
import useManageComponentLoading from "../../../../hooks/useManageComponentLoading"
import RoomList from './components/RoomList'
import { UserAvatar } from "../../../../components/Avatar"
import { FilterItem, FilterList } from "../../../../components/Filter"
import FilteredField from "../../../../components/FilteredField"
import { useMakeHorizontalScroll } from "../../../../hooks/useMakeHorizontalScroll"
import { useDisplay as useDisplaySecondScreen } from "../../../../components/SecondScreen/hookControls"
import GroupCreating from "../GroupCreating"

const UserOptions = React.lazy(() => import('./components/UserOptions'))

const UserSearching = React.memo(function UserSearching({ keySearching }) {
    const [searchType, setSearchType] = useState('*')
    const [usersData, setUsersData] = useState([])
    const [groupList, setGroupList] = useState([])
    const [groupData, setGroupData] = useState([])
    const [dataRemaining, setDataRemaining] = useState([])
    const database = getDatabase()
    const auth = getAuth()
    const user = auth.currentUser
    const filterRef = useRef()
    const navigate = useNavigate()

    useMakeHorizontalScroll(filterRef)

    const handleSetSearchType = useCallback((searchType) => {
        setSearchType(searchType)
    }, [])

    useEffect(() => {
        const usersRef = ref(database, 'users')
        const unsub = onValue(usersRef, (snapshot) => {
            if (!snapshot.val()) return
            setUsersData(Object.values(snapshot.val()))
        })

        return () => unsub()
    }, [])

    useEffect(() => {
        const groupsRef = ref(database, 'users/' + user.uid + '/groups')
        const unsub = onValue(groupsRef, (snapshot) => {
            const response = snapshot.val()
            if (!response) return
            setGroupList(Object.values(response))
        })

        return () => unsub()
    }, [])

    useEffect(() => {
        if (groupList.length < 1) return

        const unsubs = groupList.map((roomID) => {
            const roomInfoRef = ref(database, 'rooms/' + roomID + '/information/name')
            return onValue(roomInfoRef, (snapshot) => {
                const roomName = snapshot.val()
                setGroupData(prev => [
                    ...prev,
                    {
                        isGroup: true,
                        groupName: roomName,
                        roomID
                    }
                ])
            })
        })

        return () => unsubs.forEach(unsub => unsub())
    }, [groupList])

    const filterByEmail = useCallback((userData) => {
        const result = []
        userData = userData.filter(user => user.information.email === keySearching)

        userData.forEach(user => {
            result.push({
                isGroup: false,
                fUID: user.information.uid
            })
        })

        return result
    }, [keySearching])

    const filterByAccount = useCallback((userData) => {
        if (!keySearching.trim()) return []
        const result = []
        const reg = new RegExp(keySearching, 'i')
        userData = userData.filter(user => reg.test(user.information.name))

        userData.forEach(user => {
            result.push({
                isGroup: false,
                fUID: user.information.uid
            })
        })

        return result
    }, [keySearching])

    const filterByUID = useCallback((userData, groupData) => {
        let result = []
        userData = userData.filter(user => user.information.uid === keySearching)

        userData.forEach(user => {
            result.push({
                isGroup: false,
                fUID: user.information.uid
            })
        })

        groupData = groupData.filter(group => group.roomID === keySearching)
        result = [...result, ...groupData]

        return result
    }, [keySearching])

    const filterByGroup = useCallback((groupData) => {
        if (keySearching === '') return []
        const reg = new RegExp(keySearching, 'i')
        return groupData.filter((group) => reg.test(group.groupName))
    }, [keySearching])

    useEffect(() => {
        let filteredResult
        switch (searchType) {
            case '*':
                filteredResult = [
                    ...filterByEmail(usersData),
                    ...filterByAccount(usersData),
                    ...filterByUID(usersData, groupData),
                    ...filterByGroup(groupData)
                ]
                break

            case 'email':
                filteredResult = filterByEmail(usersData)
                break

            case 'account':
                filteredResult = filterByAccount(usersData)
                break

            case 'uid':
                filteredResult = filterByUID(usersData, groupData)
                break

            case 'group':
                filteredResult = filterByGroup(groupData)
                break
        }

        filteredResult = filteredResult.filter(data => data?.fUID != user.uid)

        setDataRemaining(filteredResult)
    }, [usersData, searchType, keySearching])

    const filteredFieldClick = useCallback((isGroup, roomID, fUID) => {
        if (isGroup) {
            navigate('/room/' + roomID)
        } else {
            navigate('/room/' + fUID)
        }
    }, [])

    return (
        <div className={style.userSearching}>
            <div className={style.filter} ref={filterRef}>
                <FilterList>
                    <FilterItem
                        selected={Boolean(searchType === '*')}
                        onClick={() => handleSetSearchType('*')}
                    >Tất cả</FilterItem>
                    <FilterItem
                        selected={Boolean(searchType === 'email')}
                        onClick={() => handleSetSearchType('email')}
                    >Email</FilterItem>
                    <FilterItem
                        selected={Boolean(searchType === 'account')}
                        onClick={() => handleSetSearchType('account')}
                    >Tài khoản</FilterItem>
                    <FilterItem
                        selected={Boolean(searchType === 'uid')}
                        onClick={() => handleSetSearchType('uid')}
                    >UID</FilterItem>
                    <FilterItem
                        selected={Boolean(searchType === 'group')}
                        onClick={() => handleSetSearchType('group')}
                    >Nhóm</FilterItem>
                </FilterList>
            </div>
            <div className={style.filteredUsers}>
                {
                    dataRemaining.map(
                        (data) => (
                            <FilteredField
                                key={data.roomID ?? data.fUID}
                                roomID={data.roomID}
                                isGroup={data.isGroup}
                                uid={data.fUID}
                                onClick={() => filteredFieldClick(data.isGroup, data.roomID, data.fUID)}
                            />
                        )
                    )
                }
            </div>
        </div>
    )
})

const Sidebar = React.memo(function Sidebar() {
    const [displayOption, setDisplayOption] = useState(false)
    const [displayUserSearching, setDisplayUserSearching] = useState(false)
    const manageComponentLoading = useManageComponentLoading()
    const auth = getAuth()
    const user = auth.currentUser
    const [keySearching, setKeySearching] = useState('')
    const displaySecondScreen = useDisplaySecondScreen()

    const handleToggleUserOptions = useCallback(() => {
        if (displayOption) {
            setDisplayOption(false)
        } else {
            manageComponentLoading(
                'layouts/RoomLayout/components/Sidebar/components/UserOptions',
                'UserOptions',
                () => setDisplayOption(true)
            )
        }
    }, [displayOption])

    const handleDisplayUserSearching = useCallback(() => {
        setDisplayUserSearching(true)
    }, [])

    const handleSearchInputChange = useCallback((event) => {
        const val = event.target.value
        setKeySearching(val)
    }, [])

    const handleCreateNewGroup = useCallback(() => {
        displaySecondScreen(() => <GroupCreating></GroupCreating>)
    }, [])

    return (
        <div className={style.sidebar}>
            <div className={style.header}>
                <div className={style.top}>
                    <div className={style.photo} onClick={handleToggleUserOptions}>
                        <UserAvatar
                            photoURL={user.photoURL}
                            strAlt={user.displayName ??
                                sessionStorage.getItem('createUserWithEmailAndPassword.username')}
                        />
                    </div>
                    <h1 className={style.title}>Đoạn chat</h1>
                    <div className={style.new} onClick={handleCreateNewGroup}>
                        <FontAwesomeIcon icon={faPlus} />
                    </div>
                    {
                        displayOption && <UserOptions hiddenHandling={handleToggleUserOptions} />
                    }
                </div>
                <div className={style.search}>
                    {
                        displayUserSearching &&
                        <div className={style.xSearching} onClick={() => setDisplayUserSearching(false)}>
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </div>
                    }
                    {
                        displayUserSearching ||
                        <FontAwesomeIcon
                            icon={faMagnifyingGlass}
                            className={style.searchIco}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setDisplayUserSearching(true)}
                        />
                    }
                    <input
                        className={clsx(style.input, displayUserSearching && style.inputSearching)}
                        placeholder='Tìm kiếm...'
                        onFocus={handleDisplayUserSearching}
                        value={keySearching}
                        onChange={handleSearchInputChange}
                    />
                </div>
            </div>
            <div className={style.body}>
                {
                    displayUserSearching ?
                        <UserSearching keySearching={keySearching} /> :
                        <RoomList />
                }
            </div>
        </div>
    )
})

export default Sidebar