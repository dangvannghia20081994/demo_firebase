import React from "react"

import Message from "../Message"

const MessageGroup = React.memo(function MessageGroup({
    messageGroup,
    owner,
    fUser,
    memGrInfo,
    handleReplyMessage,
    setScroll,
    roomDescription={roomDescription}
}) {
    return (
        messageGroup.map((message) => (
            <Message
                message={message}
                owner={owner}
                key={message.messKey}
                fUser={fUser}
                memGrInfo={memGrInfo}
                handleReplyMessage={handleReplyMessage}
                setScroll={setScroll}
                roomDescription={roomDescription}
            />
        ))
    )
})

export default MessageGroup