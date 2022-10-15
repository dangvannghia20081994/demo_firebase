export function isImage(file) {
    const fileType = (typeof file === 'object' ? file.type : file)
    return /image/i.test(fileType)
}

export function isVideo(file) {
    const fileType = (typeof file === 'object' ? file.type : file)
    return /video/i.test(fileType)
}