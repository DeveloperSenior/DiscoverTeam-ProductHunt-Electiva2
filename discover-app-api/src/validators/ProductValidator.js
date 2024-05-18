const Ajv = require("ajv");
const { DATE_FORMAT } = require('../utilities/Constants');
const productSchema = require("../models/schema/ProductSchema.json");
const moment = require('moment');

const ajv = new Ajv({ allErrors: true });
// Ajv option allErrors is required
require("ajv-errors")(ajv);



const validateSchema = ajv.compile(productSchema);
const validateErrors = (errors) => errors.map(error => `${error.instancePath ? error.instancePath : ''} ${error.message}`.trim());


const validateProduct = (body) => {
    return { isValid: validateSchema(body), errors: validateErrors(validateSchema.errors || []) }
}

const validateProductLaunch = (body) => {
    if (!body._id)
        return { isValid: false, errors: ["must have required property '_id'"] }
    else
        return { isValid: true, errors: [] }
}

const validateEditProduct = (_id, body) => {
    const errors = [];
    let isValid = true;
    if (!body) { errors.push("must have required body request"); isValid = false; }
    if (!_id) { errors.push("must have required property path '_id'"); isValid = false; }

    return { isValid: isValid, errors: errors }

}

const validateRemoveProduct = (_id) => {
    const errors = [];
    let isValid = true;
    if (!_id) { errors.push("must have required property path '_id'"); isValid = false; }

    return { isValid: isValid, errors: errors }

}

const validatePagerParameter = (params) => {
    const errors = [];
    let isValid = true;
    if (!params.pageSize) { errors.push("must have required property path 'pageSize'"); isValid = false; }
    if (!params.pageNumber) { errors.push("must have required property path 'pageNumber'"); isValid = false; }
    return { isValid: isValid, errors: errors }
}

module.exports = {
    validateErrors,
    validateProduct,
    validateProductLaunch,
    validateEditProduct,
    validateRemoveProduct,
    validatePagerParameter
}