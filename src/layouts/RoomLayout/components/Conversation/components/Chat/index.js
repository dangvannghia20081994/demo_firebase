import React, { useCallback, useState, useRef, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faImage,
    faFaceSmile,
    faPaperPlane,
    faXmark,
    faFileCirclePlus,
    faThumbsUp
} from "@fortawesome/free-solid-svg-icons"
import { faCirclePlay } from "@fortawesome/free-regular-svg-icons"
import clsx from "clsx"
import { v4 as uuidv4 } from "uuid"
import { getAuth } from 'firebase/auth'
import { getDatabase, onValue, push, ref, set, update } from 'firebase/database'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

import style from './Chat.module.css'
import { useHideClickOutside } from "../../../../../../hooks/useHideClickOutside"
import { useAdd as useAddToast } from "../../../../../../components/Toasts/hookControls"
import { decodeHTML } from "../../../../../../utils/decodeHTML"
import { isImage, isVideo } from "../../../../../../utils/checkFileType"

import emoji1 from '../../../../../../assets/imgs/851586_126362127548584_1211061758_n.png'
import emoji2 from '../../../../../../assets/imgs/851586_126362120881918_135461923_n.png'
import emoji3 from '../../../../../../assets/imgs/851586_126362110881919_1258215335_n.png'
import emoji4 from '../../../../../../assets/imgs/851586_126362104215253_1651254063_n.png'
import emoji5 from '../../../../../../assets/imgs/851586_126362030881927_2101660857_n.png'
import emoji6 from '../../../../../../assets/imgs/851586_126362014215262_1346191341_n.png'
import emoji7 from '../../../../../../assets/imgs/851586_126361977548599_392107290_n.png'
import emoji8 from '../../../../../../assets/imgs/851586_126361877548609_1351776047_n.png'
import emoji9 from '../../../../../../assets/imgs/851575_126362190881911_254357215_n.png'
import emoji10 from '../../../../../../assets/imgs/851575_126362140881916_1086262136_n.png'
import emoji11 from '../../../../../../assets/imgs/851575_126362090881921_1049355036_n.png'
import emoji12 from '../../../../../../assets/imgs/851575_126362084215255_683178977_n.png'
import emoji13 from '../../../../../../assets/imgs/851575_126362077548589_1478503186_n.png'
import emoji14 from '../../../../../../assets/imgs/851575_126362067548590_1152922410_n.png'
import emoji15 from '../../../../../../assets/imgs/851575_126362047548592_307032461_n.png'
import emoji16 from '../../../../../../assets/imgs/851575_126361997548597_198255234_n.png'
import emoji17 from '../../../../../../assets/imgs/851575_126361990881931_1954831463_n.png'
import emoji18 from '../../../../../../assets/imgs/851575_126361970881933_2050936102_n.png'
import emoji19 from '../../../../../../assets/imgs/851575_126361924215271_792446242_n.png'
import emoji20 from '../../../../../../assets/imgs/851575_126361914215272_209730609_n.png'

const EmojiList = React.memo(function EmojiList({ handleHideEmoji, handleSendEmoji }) {
    const emojiList = [
        emoji1, emoji2, emoji3, emoji4, emoji5,
        emoji6, emoji7, emoji8, emoji9, emoji10,
        emoji11, emoji12, emoji13, emoji14, emoji15,
        emoji16, emoji17, emoji18, emoji19, emoji20
    ]

    const emojiListRef = useRef()

    useHideClickOutside(emojiListRef, handleHideEmoji)

    return (
        <ul className={style.emojiList} ref={emojiListRef}>
            {emojiList.map((emoji, index) => (
                <Emoji
                    emoji={emoji}
                    key={index}
                    handleSendEmoji={handleSendEmoji}
                />
            ))}
        </ul>
    )
})

const Emoji = React.memo(function Emoji({ emoji, handleSendEmoji }) {
    return (
        <li onClick={() => handleSendEmoji(emoji)}>
            <img src={emoji} />
        </li>
    )
})

const FilesSelected = React.memo(
    function FilesSelected({
        filesSelected,
        handleRemoveFileSelected,
        handleAddFileSelected,
        inputRef
    }) {
        const fileInputRef = useRef()
        const addToast = useAddToast()

        const handleChooseImg = useCallback(() => {
            fileInputRef.current.click()
        }, [])

        const handleFileInputChange = useCallback((event) => {
            const files = event.target.files
            const result = {}
            for (let i = 0; i < files.length; i++) {
                if (isImage(files[i]) || isVideo(files[i])) {
                    result[uuidv4()] = files[i]
                } else {
                    addToast({
                        id: uuidv4(),
                        title: 'Xuất hiện file không hợp lệ!',
                        des: 'File ảnh không hợp lệ sẽ bị bỏ qua.',
                        type: 'error',
                        time: 5000
                    })
                }
            }
            event.target.value = ''
            handleAddFileSelected(result)
            inputRef.current.focus()
        }, [])

        return (
            <div className={style.filesSelected}>
                <div className={style.addImg} onClick={handleChooseImg}>
                    <FontAwesomeIcon icon={faFileCirclePlus} />
                    <input
                        ref={fileInputRef}
                        type='file'
                        style={{ display: 'none' }}
                        accept="image/*, video/*"
                        multiple
                        onChange={handleFileInputChange}
                    />
                </div>
                {Object.keys(filesSelected).map(
                    (key) => (
                        <FileSelected
                            file={filesSelected[key]}
                            key={key}
                            handleRemoveFileSelected={() => handleRemoveFileSelected(key)}
                        />
                    )
                )}
            </div>
        )
    }
)

const FileSelected = React.memo(function FileSelected({ file, handleRemoveFileSelected }) {
    const previewURL = URL.createObjectURL(file)
    let FileElm

    if (isImage(file)) {
        FileElm = <img src={previewURL} />
    } else if (isVideo(file)) {
        FileElm = (
            <>
                <video>
                    <source src={previewURL} />
                </video>
                <FontAwesomeIcon icon={faCirclePlay} className={style.video} />
            </>
        )
    }

    return (
        <div className={style.fileSelected}>
            {FileElm}
            <div className={style.rmFile} onClick={handleRemoveFileSelected}>
                <FontAwesomeIcon icon={faXmark} />
            </div>
        </div>
    )
})

const ReplyMessage = React.memo(function ReplyMessage({ messageReplyInfo, handleCloseReplyMessage }) {
    const ReplyTo = (
        <span style={{ color: 'var(--color)', fontWeight: 600 }}>
            {
                messageReplyInfo.fUser ?
                    messageReplyInfo.fUser.name :
                    messageReplyInfo.memGrInfo[messageReplyInfo.sendBy]?.name ?? 'Thành viên đã rời nhóm'
            }
        </span>
    )

    return (
        <div className={style.replyMessage}>
            <p className={style.title}>
                Đang trả lời {messageReplyInfo.owner ? 'chính mình' : ReplyTo}
            </p>
            <p className={style.messReply}>{decodeHTML(messageReplyInfo.message)}</p>
            <div className={style.closeReply} onClick={handleCloseReplyMessage}>
                <FontAwesomeIcon icon={faXmark} />
            </div>
        </div>
    )
})

const Chat = React.memo(
    function Chat({
        messageReplyInfo,
        handleCloseReplyMessage,
        setAutoScroll,
        setScroll,
        isNewConversation,
        setIsNewConversation,
        roomDescription
    }) {
        const [displayEmoji, setDisplayEmoji] = useState(false)
        const [filesSelected, setFilesSelected] = useState({})
        const [inputEmpty, setInputEmpty] = useState(true)
        const [inputVal, setInputVal] = useState('')
        const fileInputRef = useRef()
        const inputRef = useRef()
        const auth = getAuth()
        const user = auth.currentUser
        const database = getDatabase()
        const { roomKey, roomID, isGroup, carrier } = roomDescription
        const storage = getStorage()
        const [memGr, setMemGr] = useState()

        const addToast = useAddToast()

        const handleDisplayEmoji = useCallback(() => {
            setDisplayEmoji(true)
        }, [])

        const handleHideEmoji = useCallback(() => {
            setDisplayEmoji(false)
        }, [])

        const handleChooseImg = useCallback(() => {
            fileInputRef.current.click()
        }, [])

        const handleFileInputChange = useCallback((event) => {
            const files = event.target.files
            const result = {}
            for (let i = 0; i < files.length; i++) {
                if (isImage(files[i]) || isVideo(files[i])) {
                    result[uuidv4()] = files[i]
                } else {
                    addToast({
                        id: uuidv4(),
                        title: 'Xuất hiện file không hợp lệ!',
                        des: 'File ảnh không hợp lệ sẽ bị bỏ qua.',
                        type: 'error',
                        time: 5000
                    })
                }
            }
            event.target.value = ''
            setFilesSelected(result)
            setInputEmpty(false)
            inputRef.current.focus()
        }, [])

        const handleRemoveFileSelected = useCallback((imgKey) => {
            const remainingImgs = {}
            for (let key in filesSelected) {
                if (key != imgKey) {
                    remainingImgs[key] = filesSelected[key]
                }
            }
            if (Object.keys(remainingImgs).length < 1 && !inputVal) setInputEmpty(true)
            setFilesSelected(remainingImgs)
        }, [filesSelected, inputVal])

        const handleAddFileSelected = useCallback((addImgList) => {
            setInputEmpty(false)
            setFilesSelected(prev => ({
                ...prev,
                ...addImgList
            }))
        }, [])

        const handleChatInputChange = useCallback((event) => {
            const inputElm = event.target
            let inputVal = inputElm.innerHTML

            // Remove <br> in Mozilla
            inputVal = inputVal.replace(/^<br>|<br>$/i, "")

            if (/^<br>$/.test(inputVal) || !inputVal) {
                inputElm.innerHTML = ''
                setInputVal('')
                if (Object.keys(filesSelected).length < 1) setInputEmpty(true)
            } else {
                setInputEmpty(false)
                setInputVal(inputVal)
            }
        }, [filesSelected])

        useEffect(() => {
            if (!isGroup) return

            const memGrRef = ref(database, 'rooms/' + roomID + '/information/members')
            const unsubscribe = onValue(memGrRef, (snapshot) => {
                return snapshot.val() && setMemGr(Object.values(snapshot.val()))
            })

            return () => unsubscribe()
        }, [isGroup, roomID])

        const updateLastMessage = useCallback((message, type = 'text') => {
            let lastMessage
            switch (type) {
                case 'text':
                case 'emoji':
                case 'like':
                    lastMessage = message
                    break

                case 'media':
                    lastMessage = 'Đã gửi 1 file.'
                    break
            }

            const lastMessageUpdate = {
                message: lastMessage,
                sendBy: user.uid,
                timestamp: Date.now(),
                type
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
        }, [memGr, roomKey, user.uid, isGroup])

        const setUnseenMess = useCallback((messageKey) => {
            const unseenMessageRefs = []
            if (isGroup) {
                memGr.forEach(memUID => {
                    if (memUID != user.uid) {
                        unseenMessageRefs.push(ref(database, 'users/' + memUID + '/unseenMessages/' + roomID))
                    }
                })
            } else {
                unseenMessageRefs.push(ref(database, 'users/' + carrier.fUID + '/unseenMessages/' + roomID))
            }

            unseenMessageRefs.forEach(ref => {
                const newNodeRef = push(ref)
                set(newNodeRef, messageKey)
            })
        }, [memGr, carrier?.fUID, roomID, isGroup])

        const sendMessage = useCallback((message, type = 'text') => {
            const messageNode = {
                message,
                type,
                timestamp: Date.now(),
                sendBy: user.uid
            }

            const conversationRef = ref(database, 'rooms/' + roomID + '/conversation')
            const newMessageRef = push(conversationRef)
            const messageKey = newMessageRef.key

            if (Object.keys(messageReplyInfo).length > 0) {
                messageNode.parentMess = messageReplyInfo.messageKey

                const childMessRef = ref(
                    database,
                    'rooms/' + roomID + '/conversation/' + messageReplyInfo.messageKey + '/childMess'
                )
                const newChildKey = push(childMessRef).key
                update(ref(database), {
                    ['rooms/' + roomID + '/conversation/' + messageReplyInfo.messageKey + '/childMess/' + newChildKey]: messageKey
                })
            }

            if (isNewConversation) {
                update(ref(database), {
                    ['users/' + user.uid + '/chats/' + roomKey + '/isGroup']: isGroup,
                    ['users/' + user.uid + '/chats/' + roomKey + '/roomID']: roomID,
                    ['users/' + user.uid + '/chats/' + roomKey + '/carrier']: carrier,
                    ['users/' + user.uid + '/chats/' + roomKey + '/lastMessage']: {
                        sendBy: user.uid
                    }
                })

                update(ref(database), {
                    ['users/' + roomKey + '/chats/' + user.uid + '/isGroup']: isGroup,
                    ['users/' + roomKey + '/chats/' + user.uid + '/roomID']: roomID,
                    ['users/' + roomKey + '/chats/' + user.uid + '/carrier']: {
                        fUID: user.uid,
                        roomID: roomID
                    },
                    ['users/' +  roomKey + '/chats/' + user.uid + '/lastMessage/']: {
                        sendBy: user.uid
                    }
                })

                setIsNewConversation(false)
            }

            set(newMessageRef, messageNode)
            updateLastMessage(message, type)
            setUnseenMess(messageKey)
            handleCloseReplyMessage()
            setAutoScroll(true)
            setScroll(prev => !prev)
        }, [memGr, messageReplyInfo, roomID])

        const sendTextMessage = useCallback(() => {
            if (
                !(decodeHTML(inputVal).trim() === '') &&
                !(/^(<br>)+$/i.test(inputVal)) &&
                !(/^(<br>|&nbsp;|\s)+$/i.test(inputVal))
            ) {
                sendMessage(inputVal)
            }
            setInputVal('')
            inputRef.current.innerHTML = ''
            inputRef.current.focus()
        }, [inputVal])

        const sendImgMessage = useCallback(() => {
            if (Object.keys(filesSelected).length < 1) return

            const queueUpload = []
            const queueFileType = []

            let indexUnique = 0
            for (let key in filesSelected) {
                const file = filesSelected[key]
                const imgStorageRef = storageRef(storage, 'media/' + user.uid + indexUnique + Date.now())
                queueUpload.push(uploadBytes(imgStorageRef, file))
                indexUnique++
            }

            Promise.all(queueUpload)
                .then(snapshots => {
                    const queueGetURL = []
                    for (let snap of snapshots) {
                        const fileType = snap.metadata.contentType

                        if (isImage(fileType)) {
                            queueFileType.push('image')
                        } else if (isVideo(fileType)) {
                            queueFileType.push('video')
                        }

                        queueGetURL.push(getDownloadURL(snap.ref))

                    }
                    return Promise.all(queueGetURL)
                })
                .then(urls => {
                    const combinedResult = []
                    for (let i = 0; i < urls.length; i++) {
                        combinedResult.push({
                            url: urls[i],
                            type: queueFileType[i],
                            id: user.uid + Date.now() + i
                        })
                    }
                    sendMessage(combinedResult, 'media')
                })

            setFilesSelected({})

        }, [filesSelected, user.uid])

        const handleSendMessage = useCallback(() => {
            sendImgMessage()
            sendTextMessage()
            setInputEmpty(true)
        }, [filesSelected, inputVal])

        const handleSendEmoji = useCallback((emoji) => {
            sendMessage(emoji, 'emoji')
            setDisplayEmoji(false)
        }, [])

        const handleSendLike = useCallback(() => {
            sendMessage('', 'like')
        }, [memGr])

        const handleChatKeyDown = useCallback((event) => {
            if (event.key === 'Enter') {
                event.preventDefault()
                handleSendMessage()
            }
        }, [filesSelected, inputVal])

        useEffect(() => {
            if (messageReplyInfo.focus) inputRef.current.focus()
        }, [messageReplyInfo.focus])

        return (
            <div className={clsx(style.chatZone, Object.keys(messageReplyInfo).length > 1 && style.chatBorder)}>
                {
                    Object.keys(messageReplyInfo).length > 1 &&
                    <ReplyMessage
                        messageReplyInfo={messageReplyInfo}
                        handleCloseReplyMessage={handleCloseReplyMessage}
                    />
                }
                <div className={style.chatWr}>
                    {
                        Boolean(Object.keys(filesSelected).length < 1) &&
                        <div className={clsx(style.chooseImg, style.icoWr)} onClick={handleChooseImg}>
                            <FontAwesomeIcon icon={faImage} className={style.interactiveIcon} />
                            <input
                                ref={fileInputRef}
                                type='file'
                                style={{ display: 'none' }}
                                accept="image/*, video/*"
                                multiple
                                onChange={handleFileInputChange}
                            />
                        </div>
                    }
                    <div className={style.chatInput}>
                        <div className={style.inputWr}>
                            {
                                Boolean(Object.keys(filesSelected).length > 0) &&
                                <FilesSelected
                                    filesSelected={filesSelected}
                                    handleRemoveFileSelected={handleRemoveFileSelected}
                                    handleAddFileSelected={handleAddFileSelected}
                                    inputRef={inputRef}
                                />
                            }
                            <div
                                className={style.input}
                                contentEditable
                                onInput={handleChatInputChange}
                                ref={inputRef}
                                onKeyDown={handleChatKeyDown}
                            />
                        </div>
                        <div className={style.chooseEmojiWr}>
                            <div className={clsx(style.chooseEmoji, style.icoWr)} onClick={handleDisplayEmoji}>
                                <FontAwesomeIcon icon={faFaceSmile} className={style.interactiveIcon} />
                            </div>
                            {
                                displayEmoji &&
                                <EmojiList
                                    handleHideEmoji={handleHideEmoji}
                                    handleSendEmoji={handleSendEmoji}
                                />
                            }
                        </div>
                    </div>
                    <div
                        className={clsx(style.sendMessage, style.icoWr)}
                        onClick={inputEmpty ? handleSendLike : handleSendMessage}
                    >
                        <FontAwesomeIcon
                            icon={inputEmpty ? faThumbsUp : faPaperPlane}
                            className={style.interactiveIcon}
                        />
                    </div>
                </div>
            </div>
        )
    }
)

export default Chat