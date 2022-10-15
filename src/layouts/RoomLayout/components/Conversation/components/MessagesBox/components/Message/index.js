import React, { useCallback, useState, useRef, useMemo, useEffect } from "react"
import { createPortal, flushSync } from 'react-dom'
import clsx from "clsx"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faTrash,
    faReply,
    faXmark,
    faThumbsUp
} from "@fortawesome/free-solid-svg-icons"
import { faCirclePlay } from "@fortawesome/free-regular-svg-icons"
import { faFaceSmile } from "@fortawesome/free-regular-svg-icons"
import { getDatabase, onValue, ref, set, update } from 'firebase/database'
import { getAuth } from "firebase/auth"

import style from './Message.module.css'
import { TooltipMessageInteractive } from "../../../../../../../../components/Tooltip"
import {
    useDisplay as useDisplaySecondScreen,
    useHide as useHideSecondScreen
} from "../../../../../../../../components/SecondScreen/hookControls"
import { useHideClickOutside } from "../../../../../../../../hooks/useHideClickOutside"
import { decodeHTML } from "../../../../../../../../utils/decodeHTML"
import Modal_Box from "../../../../../../../../components/Modal_Box"
import { UserAvatar } from "../../../../../../../../components/Avatar"

import heart from '../../../../../../../../assets/imgs/2764.png'
import haha from '../../../../../../../../assets/imgs/1f606.png'
import wow from '../../../../../../../../assets/imgs/1f62e.png'
import sad from '../../../../../../../../assets/imgs/1f622.png'
import angry from '../../../../../../../../assets/imgs/1f620.png'
import like from '../../../../../../../../assets/imgs/1f44d.png'
import { LightBtn, PrimaryBtn } from "../../../../../../../../components/Button"

const MessageInteractiveTitle = React.memo(
    function MessageInteractiveTitle({ ableDisplayIntertactiveTitle, icon, title, onClick }) {
        const [displayTitle, setDisplayTitle] = useState(false)

        return (
            <li
                onMouseEnter={() => setDisplayTitle(true)}
                onMouseLeave={() => setDisplayTitle(false)}
                onClick={onClick}
            >
                <FontAwesomeIcon icon={icon} />
                {
                    ableDisplayIntertactiveTitle && displayTitle &&
                    <div className={style.title}>
                        <TooltipMessageInteractive>{title}</TooltipMessageInteractive>
                    </div>
                }
            </li>
        )
    }
)

const FeelingsForMessage = React.memo(function FeelingsForMessage({ owner, setDisplayFeelingList, messKey, roomDescription }) {
    const feelingList = [heart, haha, wow, sad, angry, like]
    const feelingListRef = useRef()
    const database = getDatabase()
    const auth = getAuth()
    const user = auth.currentUser
    const { roomID } = roomDescription

    const handleClickOutside = useCallback(() => {
        setDisplayFeelingList(false)
    }, [])

    const sendFeeling = useCallback((icon) => {
        const feel = {
            feeling: icon,
            user: user.uid
        }

        update(ref(database), {
            ['rooms/' + roomID + '/conversation/' + messKey + '/feelings/' + user.uid]: feel
        })

        setDisplayFeelingList(false)
    }, [])

    useHideClickOutside(feelingListRef, handleClickOutside)

    return (
        <ul
            ref={feelingListRef}
            className={clsx(style.feelingsList, owner ? style.rightDeviation : style.leftDeviation)}
        >
            {
                feelingList.map((feeling, index) => (
                    <Feeling
                        icon={feeling}
                        key={index}
                        handleSendFeeling={() => sendFeeling(feeling)}
                    />
                ))
            }
        </ul>
    )
})

const Feeling = React.memo(function Feeling({ icon, handleSendFeeling }) {
    return (
        <li className={style.feeling} onClick={handleSendFeeling}>
            <img src={icon} />
        </li>
    )
})

const MediaViewer = React.memo(function MediaViewer({ url, type }) {
    const hideSecondScreen = useHideSecondScreen()

    const hideMediaViewer = useCallback(() => {
        hideSecondScreen()
    }, [])

    let MediaContent
    switch (type) {
        case 'image':
            MediaContent = <img className={style.mediaContent} src={url} />
            break

        case 'video':
            MediaContent = (
                <video className={style.mediaContent} autoPlay controls>
                    <source src={url} />
                </video>
            )
            break
    }

    return (
        <div className={style.mediaViewerWr}>
            <div className={style.mediaViewer} style={{ backgroundImage: 'url(' + url + ')' }} />
            {MediaContent}
            <div className={style.closeMedia} onClick={hideMediaViewer}>
                <FontAwesomeIcon icon={faXmark} />
            </div>
        </div>
    )
})

const Mess = React.memo(function Mess({
    message,
    setDisplayFeelingList,
    handleReplyMessage,
    owner,
    fUser,
    memGrInfo,
    setScroll,
    roomDescription
}) {
    const database = getDatabase()
    const { roomID } = roomDescription
    const [parentMess, setParentMess] = useState()
    const [displayInteractiveTitle, setDisplayInteractiveTitle] = useState(false)
    const timerRef = useRef()
    const displaySecondScreen = useDisplaySecondScreen()

    const enableDisplayInteractiveTitle = useCallback(() => {
        timerRef.current = setTimeout(() => setDisplayInteractiveTitle(true), 500)
    }, [])

    const disableDisplayInteractiveTitle = useCallback(() => {
        clearInterval(timerRef.current)
        setDisplayInteractiveTitle(false)
    }, [])

    const handleDisplayFeelingList = useCallback(() => {
        setDisplayFeelingList(true)
        setDisplayInteractiveTitle(false)
    }, [])

    const removeMessage = useCallback(() => {
        displaySecondScreen(() => <RemoveMessage messageKey={message.messKey} roomDescription={roomDescription} />)
    }, [])

    const displayMediaViewer = useCallback((url, type) => {
        displaySecondScreen(() => <MediaViewer url={url} type={type} />)
    }, [])

    let Mess

    switch (message.type) {
        case 'text':
            Mess = (
                <p className={style.textMess}>
                    {decodeHTML(message.message)}
                </p>
            )
            break

        case 'media':
            Mess = (
                <ul className={style.mediaMess}>
                    {
                        message.message.map((media) => (
                            <li
                                key={media.id}
                                onClick={() => displayMediaViewer(media.url, media.type)}
                                className={style.media}
                            >
                                {
                                    media.type === 'image' ?
                                        <img src={media.url} className={style.thumb} /> :
                                        <>
                                            <video autoPlay muted loop className={style.thumb}>
                                                <source src={media.url} />
                                            </video>
                                            <FontAwesomeIcon icon={faCirclePlay} className={style.videoMarkup} />
                                        </>
                                }
                            </li>
                        ))
                    }
                </ul>
            )
            break

        case 'emoji':
            Mess = (
                <div className={style.emoji}>
                    <img src={message.message} />
                </div>
            )
            break

        case 'like':
            Mess = (
                <div className={style.liked}>
                    <FontAwesomeIcon icon={faThumbsUp} />
                </div>
            )
            break
    }

    useEffect(() => {
        if (!message.parentMess) return

        const parentMessRef = ref(database, 'rooms/' + roomID + '/conversation/' + message.parentMess + '/message')
        const unsub = onValue(parentMessRef, (snapshot) => {
            setParentMess(snapshot.val())
        })

        return () => unsub()
    }, [])

    useEffect(() => {
        if (!message.isLast) return
        setScroll(prev => !prev)
    }, [parentMess])

    return (
        <div className={style.messageContent}>
            {
                parentMess &&
                <span className={style.parentMess}>{decodeHTML(parentMess)}</span>
            }
            <div className={style.mess}>
                {Mess}
                <ul className={style.interactive}
                    onMouseEnter={enableDisplayInteractiveTitle}
                    onMouseLeave={disableDisplayInteractiveTitle}
                >
                    <MessageInteractiveTitle
                        ableDisplayIntertactiveTitle={displayInteractiveTitle}
                        title='Bày tỏ cảm xúc'
                        icon={faFaceSmile}
                        onClick={handleDisplayFeelingList}
                    />
                    <MessageInteractiveTitle
                        ableDisplayIntertactiveTitle={displayInteractiveTitle}
                        title='Trả lời'
                        icon={faReply}
                        onClick={() => handleReplyMessage({
                            owner,
                            fUser,
                            messageKey: message.messKey,
                            message: message.message,
                            sendBy: message.sendBy,
                            memGrInfo
                        })}
                    />
                    <MessageInteractiveTitle
                        ableDisplayIntertactiveTitle={displayInteractiveTitle}
                        title='Xóa'
                        icon={faTrash}
                        onClick={() => removeMessage()}
                    />
                </ul>
                <FeelOnMess
                    feelings={message.feelings}
                    fUser={fUser}
                    memGrInfo={memGrInfo}
                    messageKey={message.messKey}
                    roomDescription={roomDescription}
                />
            </div>
        </div>
    )
})

const FeelDetailOnMess = React.memo(function FeelDetailOnMess({ feelDetail, feelType, feelCount, roomDescription }) {
    const [filterType, setFilterType] = useState('*')
    const [dataFilter, setDataFilter] = useState([])
    const auth = getAuth()
    const user = auth.currentUser
    const { roomID } = roomDescription
    const database = getDatabase()

    const filter = useCallback((feeling = '*') => {
        setFilterType(feeling)
    }, [])

    useEffect(() => {
        const dataFilter = filterType === '*' ?
            feelDetail :
            feelDetail.filter((feel) => feel.feeling === filterType)

        setDataFilter(dataFilter)
    }, [filterType, feelDetail])

    const unFeel = useCallback((messageKey) => {
        const feelRef = ref(database, 'rooms/' + roomID + '/conversation/' + messageKey + '/feelings/' + user.uid)
        set(feelRef, null)
    }, [])

    return (
        <div className={style.feelDetail}>
            <ul className={style.filterBar}>
                <li onClick={() => filter()} className={clsx('*' === filterType && style.filter)}>
                    <span className={style.num}>Tất cả {feelCount}</span>
                </li>
                {
                    Object.values(feelType).map((feel) => {
                        return (
                            <li
                                key={feel.feeling}
                                className={clsx(style.feelD, feel.feeling === filterType && style.filter)}
                                onClick={() => filter(feel.feeling)}
                            >
                                <img src={feel.feeling} />
                                <span className={style.num}>{feel.numbers}</span>
                            </li>
                        )
                    })
                }
            </ul>
            <ul className={style.feelList}>
                {
                    dataFilter.map(feel => (
                        <li
                            className={clsx(style.feelItem, feel.sendBy === user.uid && style.ownFeel)}
                            key={feel.feelingKey}
                            onClick={
                                feel.sendBy === user.uid ?
                                    () => unFeel(feel.messageKey) :
                                    () => { }
                            }
                        >
                            <div className={style.left}>
                                <div className={style.avt}>
                                    <UserAvatar photoURL={feel.photoURL} strAlt={feel.name} />
                                </div>
                                <div className={style.name}>
                                    <h3>{feel.name}</h3>
                                    {
                                        feel.sendBy === user.uid &&
                                        <p className={style.unfeel}>Nhấp để gỡ</p>
                                    }
                                </div>
                            </div>
                            <div className={style.right}>
                                <img src={feel.feeling} />
                            </div>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
})

const FeelOnMessPortal = React.memo(function FeelOnMessDetail({ children }) {
    const [secondScreenElm] = useState(document.getElementById('2nd__screen'))
    return (
        createPortal(children, secondScreenElm)
    )
})

const FeelOnMess = React.memo(function FeelOnMess({ feelings, fUser, memGrInfo, messageKey, roomDescription }) {
    const { isGroup } = roomDescription
    const auth = getAuth()
    const user = auth.currentUser
    const displaySecondScreen = useDisplaySecondScreen()
    const [displayFeelDetailOnMess, setDisplayFeelDetailOnMess] = useState(false)

    const feelDetail = useMemo(() => {
        const feelDetail = []

        for (let key in feelings) {
            feelings[key].feelingKey = key
        }

        if (isGroup) {
            for (let uid in feelings) {
                if (!memGrInfo) break
                feelDetail.push({
                    name: memGrInfo[uid]?.name ?? 'Thành viên đã rời nhóm',
                    photoURL: memGrInfo[uid]?.photoURL,
                    feeling: feelings[uid]?.feeling,
                    feelingKey: feelings[uid]?.feelingKey,
                    sendBy: uid,
                    messageKey
                })
            }
        } else {
            for (let uid in feelings) {
                const name = uid === user.uid ? user.displayName : fUser.name
                const photoURL = uid === user.uid ? user.photoURL : fUser.photoURL
                feelDetail.push({
                    name,
                    photoURL,
                    feeling: feelings[uid].feeling,
                    feelingKey: feelings[uid].feelingKey,
                    sendBy: uid,
                    messageKey
                })
            }
        }

        return feelDetail
    }, [feelings, memGrInfo])

    const feelType = useMemo(() => {
        const feelType = {}

        feelDetail.forEach((feel) => {
            const feelURL = feel.feeling
            if (feelType[feelURL]) {
                ++feelType[feelURL].numbers
            } else {
                feelType[feelURL] = {
                    feeling: feelURL,
                    numbers: 1
                }
            }
        })

        return feelType
    }, [feelDetail])

    const feelCount = useMemo(() => {
        let feelCount = 0

        Object.values(feelType).map(feeling => feelCount += feeling.numbers)

        return feelCount
    }, [feelType])

    const sameFeeling = useMemo(() => {
        return Object.values(feelType).some(feeling => feeling.numbers > 1)
    }, [feelType])

    const handleDisplayDetail = useCallback(() => {
        flushSync(displaySecondScreen(() => <></>))
        setDisplayFeelDetailOnMess(true)
    }, [])

    return (
        <>
            <ul className={style.feelOnMess} onClick={handleDisplayDetail}>
                {
                    Object.values(feelType).map((feeling, index) => {
                        return (
                            <li className={style.feel} key={feeling.feeling} style={{ zIndex: -index }}>
                                <img src={feeling.feeling} />
                            </li>
                        )
                    })
                }
                {
                    sameFeeling &&
                    <li className={style.feelCount}>{feelCount}</li>
                }
            </ul>
            {
                displayFeelDetailOnMess &&
                <FeelOnMessPortal>
                    <Modal_Box
                        title='Cảm xúc về tin nhắn'
                        callbackWhenClickClose={() => setDisplayFeelDetailOnMess(false)}
                    >
                        <FeelDetailOnMess
                            feelDetail={feelDetail}
                            feelType={feelType}
                            feelCount={feelCount}
                            roomDescription={roomDescription}
                        />
                    </Modal_Box>
                </FeelOnMessPortal>
            }
        </>
    )
})

const RemoveMessage = React.memo(function RemoveMessage({ messageKey, roomDescription }) {
    const hideSecondScreen = useHideSecondScreen()
    const database = getDatabase()
    const { roomID, isGroup, roomKey } = roomDescription
    const [memGr, setMemGr] = useState([])
    const auth = getAuth()
    const user = auth.currentUser

    useEffect(() => {
        if (!isGroup) return

        const memGrRef = ref(database, 'rooms/' + roomID + '/information/members')
        const unsubscribe = onValue(memGrRef, (snapshot) => {
            snapshot.val() ?
                setMemGr(Object.values(snapshot.val())) :
                setMemGr([])
        })

        return () => unsubscribe()
    }, [])

    const removeMessage = useCallback((messKey) => {
        const messRef = ref(database, 'rooms/' + roomID + '/conversation/' + messKey)
        const childMessRef = ref(database, 'rooms/' + roomID + '/conversation/' + messKey + '/childMess')
        const unsub = onValue(childMessRef, (snapshot) => {
            let childMess = snapshot.val()
            if (childMess) {
                childMess = Object.values(childMess)
                childMess.forEach(messKey => removeMessage(messKey))
            }
            set(messRef, null)
        })

        //

        const lastMessageUpdate = {
            message: user.displayName + ' đã xóa 1 tin nhắn.',
            sendBy: user.uid,
            timestamp: Date.now(),
            type: 'text'
        }

        const updates = {}
        if (isGroup) {
            memGr.forEach(memUID => {
                updates['users/' + memUID + '/chats/' + roomKey + '/lastMessage'] = lastMessageUpdate
            })
        } else {
            updates['users/' + user.uid + '/chats/' + roomKey + '/lastMessage'] = lastMessageUpdate
            updates['users/' + roomKey + '/chats/' + user.uid + '/lastMessage'] = lastMessageUpdate
        }

        update(ref(database), updates)

        // 

        return () => unsub()
    }, [memGr])

    const handleRemoveMessage = useCallback(() => {
        removeMessage(messageKey)
        hideSecondScreen()
    }, [messageKey, memGr])

    return (
        <Modal_Box title='Bạn muốn xóa tin nhắn này?'>
            <p className={style.noteRemove}>Hành động này cũng sẽ xóa các tin nhắn liên quan.</p>
            <div className={style.removeMessageControls}>
                <LightBtn title='Hủy' onClick={hideSecondScreen} />
                <PrimaryBtn title='Xóa tin nhắn' onClick={handleRemoveMessage} />
            </div>
        </Modal_Box>
    )
})

const Message = React.memo(function Message({
    message,
    owner,
    fUser,
    memGrInfo,
    handleReplyMessage,
    setScroll,
    roomDescription
}) {
    const [displayFeelingList, setDisplayFeelingList] = useState(false)
    return (
        <>
            <div
                className={
                    clsx(
                        style.messageWr,
                        owner ? style.owner : style.notOwn,
                        message.feelings && style.hasFeel
                    )
                }
            >
                <Mess
                    message={message}
                    setDisplayFeelingList={setDisplayFeelingList}
                    handleReplyMessage={handleReplyMessage}
                    owner={owner}
                    fUser={fUser}
                    memGrInfo={memGrInfo}
                    setScroll={setScroll}
                    roomDescription={roomDescription}
                />
                {
                    displayFeelingList &&
                    <FeelingsForMessage
                        owner={owner}
                        setDisplayFeelingList={setDisplayFeelingList}
                        messKey={message.messKey}
                        roomDescription={roomDescription}
                    />
                }
            </div>
        </>
    )
})

export default Message