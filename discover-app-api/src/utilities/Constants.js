const HTTP_CODE = {
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    UNAUTHORIZED: 401,
    CREATED: 201,
    OK: 200,
    NO_CONTENT: 204,
    ERROR: 500,
    MOVED_PERMANENTLY: 301
}

const ERROR_CODE = {
    DEFAULT: 'API-01-001',
    ACCESS: 'API-02-001',
    VALIDATE: 'API-03-001'
}

const ERROR_TYPE = {
    DEFAULT: 'Technical',
    ACCESS: 'Access',
    VALIDATE: 'Validate'
}

const ERROR_MESSAGE = {
    DEFAULT: 'An unexpected exception was found in the application. Review details in the log',
    ACCESS: 'An unexpected exception was found in the Access, put valid Bearer token Authorization Header',
    PRODUCT_ISNT_SESSION: 'An unexpected exception was found in the validate product, the product does not belong to the user in session',
    PRODUCT_NOT_FOUND: 'An unexpected exception was found in the validate product, the product does not found'

}

const HEADERS = {
    AUTHORIZATION: 'Authorization',
}

const DATE_FORMAT = {
    DEFAULT : 'YYYY-MM-DD'
}

const STATES = {
    INITIAL: 'P', // Pending To Launch
    LAUNCHED: 'L', // Product Launched
    INACTIVE: 'I' // Product Inactive
}

module.exports = { HTTP_CODE, HEADERS, ERROR_CODE, ERROR_TYPE, ERROR_MESSAGE, DATE_FORMAT, STATES }