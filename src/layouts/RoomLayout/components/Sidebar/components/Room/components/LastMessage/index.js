import React, { useState, useEffect } from "react"
import { getAuth } from "firebase/auth"
import { getDatabase, off, onValue, ref } from "firebase/database"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons"
import clsx from "clsx"

import style from './LastMessage.module.css'
import { getTimeLine } from "../../../../../../../../utils/timeConversion"
import { decodeHTML } from "../../../../../../../../utils/decodeHTML"

const LastMessage = React.memo(function LastMessage({ isGroup, lastMessage, unseen }) {
    const auth = getAuth()
    const user = auth.currentUser
    const database = getDatabase()
    const [sendByUser, setSendByUser] = useState()
    const [timeLine, setTimeLine] = useState()

    useEffect(() => {
        if (user.uid === lastMessage.sendBy) {
            setSendByUser('Bạn')
            return
        }

        if (!isGroup) {
            setSendByUser('')
            return
        } else {
            const fUserRef = ref(database, 'users/' + lastMessage.sendBy + '/information/name')
            onValue(fUserRef, (snapshot) => setSendByUser(snapshot.val()))

            return () => off(fUserRef)
        }
    }, [lastMessage.sendBy])

    useEffect(() => {
        setTimeLine(getTimeLine(lastMessage.timestamp))

        const timer = setInterval(() => {
            const timeLine = getTimeLine(lastMessage.timestamp)
            setTimeLine(timeLine)
        }, 30e3)

        return () => clearInterval(timer)
    }, [lastMessage.timestamp])

    let Message
    switch (lastMessage.type) {
        case 'emoji':
            Message = (
                <div className={clsx(style.message, style.flexCenter, unseen && style.unseenMessage)}>
                    {
                        sendByUser &&
                        <p>{sendByUser}:</p>
                    }
                    <img src={lastMessage.message} className={style.notText} />
                </div>
            )
            break

        case 'like':
            Message = (
                <div className={clsx(style.message, style.flexCenter, unseen && style.unseenMessage)}>
                    {
                        sendByUser &&
                        <p>{sendByUser}:</p>
                    }
                    <FontAwesomeIcon icon={faThumbsUp}
                        className={clsx(style.likeIco, style.notText, unseen && style.unseenMessage)}
                    />
                </div>
            )
            break

        default:
            Message = (
                <p className={clsx(style.message, unseen && style.unseenMessage)}>
                    {
                        sendByUser != '' ?
                            (sendByUser + ': ' + decodeHTML(lastMessage.message)) :
                            decodeHTML(lastMessage.message)
                    }
                </p>
            )
    }

    return (
        <>
            {Message}
            <p className={style.timestamp}>{timeLine}</p>
        </>
    )
})

export default LastMessage