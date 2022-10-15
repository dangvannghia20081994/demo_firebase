export function timeConversion(timestamp, mode) {
    const time = new Date(timestamp)
    const fullYear = time.getFullYear()
    const month = time.getMonth()
    const date = time.getDate()
    const hour = time.getHours()
    const minute = time.getMinutes()

    switch (mode) {
        case 'offline':
            return 'offline'

        case 'h:m,d-m-y':
            return `${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}, ${date} thg ${month} năm ${fullYear}`

        default: // d-m
            return `${date} thg ${month}`
    }
}

export function getTimeLine(timestamp, mode) {
    const now = Date.now()
    let distance = now - timestamp
    if ((distance /= 1000) < 60) {
        return Math.floor(distance) < 1 ? '1 giây' : Math.floor(distance) + ' giây'
    } else if ((distance /= 60) < 60) {
        return Math.floor(distance) + ' phút'
    } else if ((distance /= 60) < 24) {
        return Math.floor(distance) + ' giờ'
    } else {
        return timeConversion(timestamp, mode)
    }
}