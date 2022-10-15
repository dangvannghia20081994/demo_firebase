function matchSpecialCharacter(data) {
    const reg = /[\[\]\{\}+=~!@#$%^&*()|\\.,;:'"~`\-\_/]+/i
    return reg.test(data)
}

function matchStartOrEndWithSpace(data) {
    const reg = /^\s|\s$/i
    return reg.test(data)
}

function mathMail(data) {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i
    return reg.test(data)
}

function matchLength(data, min, max) {
    const reg = new RegExp(`^.{${min},${max}}$`, 'i')
    return reg.test(data)
}

function matchSame(data, sampleData) {
    return data === sampleData
}

export function validate(data, rules) {
    const validationResult = []

    if (rules.specialCharacters) {
        if (matchSpecialCharacter(data)) {
            validationResult.push({
                message: rules.specialCharacters.errMessage ||
                    'Không được bao gồm các ký tự đặc biệt: \[\]\{\}+=~!@#$%^&*()|\\.,;:\'"~`\-\_/.'
            })
        }
    }

    if (rules.length) {
        const min = rules.length.rule.min
        const max = rules.length.rule.max
        if (!matchLength(data, min, max)) {
            validationResult.push({
                message: rules.length.errMessage ||
                    `Độ dài không hợp lệ. Yêu cầu: ${min} - ${max} ký tự.`
            })
        }
    }

    if (rules.email) {
        if (!mathMail(data)) {
            validationResult.push({
                message: rules.email.errMessage ||
                    'Địa chỉ mail không hợp lệ.'
            })
        }
    }

    if (rules.startOrEndWithSpace) {
        if (matchStartOrEndWithSpace(data)) {
            validationResult.push({
                message: rules.startOrEndWithSpace.errMessage ||
                    'Không được xuất hiện ký tự khoảng trắng ở đầu hoặc cuối giá trị.'
            })
        }
    }

    if (rules.sameWith) {
        if (!matchSame(data, rules.sameWith.rule)) {
            validationResult.push({
                message: rules.sameWith.errMessage ||
                    'Dữ liệu không khớp.'
            })
        }
    }

    return validationResult
}