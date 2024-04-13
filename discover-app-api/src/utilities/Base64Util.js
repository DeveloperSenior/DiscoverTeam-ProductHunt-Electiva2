
const decode = (value, code = 'utf-8') => {
    return Buffer.from(value, 'base64').toString(code);
}

const encodeBase64 = (value) => {
    return Buffer.from(value).toString('base64');
}

const decodeBase64toAscii = (value) => {
    return decode(value, 'ascii');
}

const decodeBase64 = (value) => {
    return decode(value);
}



module.exports = { encodeBase64, decodeBase64toAscii, decodeBase64 }