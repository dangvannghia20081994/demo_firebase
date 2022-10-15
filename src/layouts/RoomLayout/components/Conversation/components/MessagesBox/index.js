import React, { useCallback, useEffect, useRef, useState } from "react"
import { getDatabase, onValue, ref } from "firebase/database"
import { getAuth } from "firebase/auth"
import clsx from "clsx"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faArrowDown,
    faAngleDown
} from "@fortawesome/free-solid-svg-icons"

import style from './MessagesBox.module.css'
import MessageGroup from "./components/MessageGroup"
import { timeConversion } from "../../../../../../utils/timeConversion"
import { UserAvatar } from "../../../../../../components/Avatar"

const MessagesBox = React.memo(
    function MessagesBox({
        handleReplyMessage,
        autoScroll,
        setAutoScroll,
        scroll,
        setScroll,
        roomDescription
    }) {
        const { roomID, isGroup, carrier } = roomDescription
        const database = getDatabase()
        const [conversation, setConversation] = useState([])
        const auth = getAuth()
        const user = auth.currentUser
        const [fUser, setFUser] = useState({})
        const [memGr, setMemGr] = useState()
        const [memGrInfo, setMemGrInfo] = useState()
        const messageBoxRef = useRef()
        const messageGroupRef = useRef()
        const [scrollToBottom, setScrollToBottom] = useState(false)
        const prevScrollStateRef = useRef(scroll)
        const [newMessage, setNewMessage] = useState(false)

        const handleMessages = useCallback((messages) => {
            const result = []
            let group = []
            messages.forEach((message, index, origin) => {
                if (origin[index + 1] === undefined) {
                    message.isLast = true
                }

                group.push(message)

                if (origin[index + 1]?.sendBy != message.sendBy) {
                    result.push(group)
                    group = []
                }

                if (origin[index + 1]?.timestamp - message.timestamp >= 6e5) {
                    if (group.length > 0) result.push(group)
                    group = []
                    result.push(message.timestamp)
                }
            })
            return result
        }, [])

        useEffect(() => {
            const conversationRef = ref(database, 'rooms/' + roomID + '/conversation')
            const unsub = onValue(conversationRef, (snapshot) => {
                let messages = snapshot.val()
                if (messages) {
                    for (let key in messages) {
                        messages[key].messKey = key
                    }
                    messages = Object.values(messages)
                    setConversation(handleMessages(messages))
                } else {
                    setConversation([])
                }
            })

            return () => unsub()
        }, [roomID])

        useEffect(() => {
            if (carrier === undefined || isGroup) return

            const fUserRef = ref(database, 'users/' + carrier.fUID + '/information')
            const unsubscribe = onValue(fUserRef, (snapshot) => {
                setFUser(snapshot.val())
            })

            return () => unsubscribe()
        }, [isGroup, carrier?.fUID])

        useEffect(() => {
            if (!isGroup) return

            const memGrRef = ref(database, 'rooms/' + roomID + '/information/members')
            const unsubscribe = onValue(memGrRef, (snapshot) => {
                return snapshot.val() && setMemGr(Object.values(snapshot.val()))
            })

            return () => unsubscribe()
        }, [isGroup, roomID])

        useEffect(() => {
            if (!memGr) return

            const queueGetInfo = []
            const queueUnsubscribe = []

            memGr.forEach(memUID => {
                const memInfoRef = ref(database, 'users/' + memUID + '/information')
                queueGetInfo.push(
                    new Promise((resolve) => {
                        const unsubscribe = onValue(memInfoRef, (snapshot) => {
                            const returned = snapshot.val()
                            resolve({ [memUID]: returned })
                        })
                        queueUnsubscribe.push(unsubscribe)
                    })
                )
            })

            Promise
                .all(queueGetInfo)
                .then(result => {
                    const final = {}
                    result.forEach((memInfo) => {
                        for (let key in memInfo) {
                            final[key] = memInfo[key]
                        }
                    })
                    setMemGrInfo(final)
                })

            return () => {
                queueUnsubscribe.forEach((unsubscribe) => unsubscribe())
            }
        }, [memGr])

        useEffect(() => {
            const messageBoxElm = messageBoxRef.current

            const handleScroll = function () {
                const scrollHeight = messageBoxElm.scrollHeight
                const offsetHeight = messageBoxElm.offsetHeight
                const scrollableHeight = scrollHeight - offsetHeight
                const scrollTop = messageBoxElm.scrollTop
                if (scrollableHeight - scrollTop < 500) {
                    setScrollToBottom(false)
                    setAutoScroll(true)
                } else {
                    setScrollToBottom(true)
                    setAutoScroll(false)
                }
            }

            messageBoxElm.addEventListener('scroll', handleScroll)

            return () => messageBoxElm.removeEventListener('scroll', handleScroll)
        }, [])

        const handleScrollToNewMessage = useCallback(() => {
            messageGroupRef.current?.scrollIntoView({ block: "end", inline: "nearest" })
            setNewMessage(false)
        }, [])

        useEffect(() => {
            if (!autoScroll || scroll === prevScrollStateRef.current) return
            prevScrollStateRef.current = scroll
            handleScrollToNewMessage()
            messageBoxRef.current.classList.remove(style.unvisiable)
        }, [autoScroll, scroll])

        useEffect(() => {
            const unseenMessageRef = ref(database, 'users/' + user.uid + '/unseenMessages/' + roomID)
            const unsub = onValue(unseenMessageRef, (snapshot) => {
                const response = snapshot.val()
                if (!response || autoScroll) return

                setNewMessage(true)
            })

            return () => unsub()
        }, [autoScroll, roomID, user.uid])

        return (
            <div className={clsx(style.messagesBox, style.unvisiable)} ref={messageBoxRef}>
                {
                    conversation.map(
                        (elm) => {
                            if (Array.isArray(elm)) {
                                return (
                                    <div
                                        className={style.messageGroup}
                                        key={elm[0].sendBy + elm[0].timestamp}
                                        ref={messageGroupRef}
                                    >
                                        {
                                            elm[0].sendBy === user.uid ||
                                            <div className={style.fUser}>
                                                {
                                                    isGroup ?
                                                        <UserAvatar
                                                            photoURL={memGrInfo && memGrInfo[elm[0].sendBy]?.photoURL}
                                                            strAlt={memGrInfo && memGrInfo[elm[0].sendBy]?.name}
                                                        /> :
                                                        <UserAvatar
                                                            photoURL={fUser.photoURL}
                                                            strAlt={fUser.name}
                                                        />
                                                }
                                            </div>
                                        }
                                        <div className={clsx(style.msGr, elm[0].sendBy === user.uid && style.owner)}>
                                            {
                                                elm[0].sendBy === user.uid ||
                                                isGroup &&
                                                memGrInfo &&
                                                <p className={style.ownerName}>
                                                    {memGrInfo[elm[0].sendBy]?.name ?? 'Thành viên đã rời nhóm'}
                                                </p>
                                            }
                                            <MessageGroup
                                                owner={elm[0].sendBy === user.uid}
                                                messageGroup={elm}
                                                fUser={fUser}
                                                memGrInfo={memGrInfo}
                                                handleReplyMessage={handleReplyMessage}
                                                setScroll={setScroll}
                                                roomDescription={roomDescription}
                                            />
                                        </div>
                                    </div>
                                )
                            } else {
                                return <p className={style.timeline} key={elm}>{timeConversion(elm, 'h:m,d-m-y')}</p>
                            }
                        }
                    )
                }
                {
                    scrollToBottom &&
                    < div className={style.toNewMess} onClick={handleScrollToNewMessage}>
                        {
                            newMessage ?
                                <p className={style.newMess}>
                                    Tin nhắn mới
                                    <FontAwesomeIcon icon={faAngleDown} className={style.dwArrow} />
                                </p>
                                :
                                <div className={style.scrollToBottom}>
                                    <FontAwesomeIcon icon={faArrowDown} />
                                </div>
                        }
                    </div>
                }
            </div >
        )
    }
)

export default MessagesBox