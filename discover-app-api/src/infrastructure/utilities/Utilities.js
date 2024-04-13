const jwt = require('jsonwebtoken');
const { decodeBase64 } = require('../../infrastructure/utilities/Base64Util');
const { HEADERS } = require('../../infrastructure/utilities/Constants');
const DefaultException = require('../../infrastructure/exception/DefaultException');


/**
 * inject functions pattern 
 * @param  {...any} fns 
 * @returns 
 */
const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);

/**
 * Get User session
 * @param {*} request HTTP param
 * @returns JSON with session info
 * @throws exception if invalid token
 */
const getSession = (request) => {
    const token = request.header(HEADERS.AUTHORIZATION);
    if (token) {
        try {
            const arrayToken = token.split(" ");
            return jwt.verify(arrayToken[1], decodeBase64(process.env.JWT_SECRET_KEY));
        } catch (error) {
            throw new DefaultException(error.message);
        }
    }
    return null;
}

module.exports = { pipe, getSession }