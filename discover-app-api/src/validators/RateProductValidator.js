const Ajv = require("ajv");
const rateProductSchema = require("../models/schema/RateProductSchema.json");

const ajv = new Ajv({ allErrors: true });
// Ajv option allErrors is required
require("ajv-errors")(ajv);

const validateSchema = ajv.compile(rateProductSchema);
const validateErrors = (errors) => errors.map(error => `${error.instancePath ? error.instancePath : ''} ${error.message}`.trim());

/**
 * validate Param Id Product
 * @param {*} _id 
 * @returns 
 */
const validateParamIdProduct = (_id) => {
    const errors = [];
    let isValid = true;
    if (!_id) { errors.push("must have required property path '_id'"); isValid= false }
    return { errors:errors, isValid: isValid }
}

/**
 * validate Rate Product
 * @param {*} body 
 * @param {*} _id 
 * @returns 
 */
const validateRateProduct = (body,_id) => {

    if (!_id) return { errors:["must have required property path '_id'"], isValid: false }
    return { isValid: validateSchema(body), errors: validateErrors(validateSchema.errors || []) }
}


module.exports = {validateErrors, validateRateProduct, validateParamIdProduct }