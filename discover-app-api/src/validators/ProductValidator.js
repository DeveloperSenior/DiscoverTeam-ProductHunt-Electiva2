const Ajv = require("ajv");
const { DATE_FORMAT } = require('../utilities/Constants');
const productSchema = require("../models/schema/ProductSchema.json");
const moment = require('moment');

const ajv = new Ajv({ allErrors: true });
// Ajv option allErrors is required
require("ajv-errors")(ajv);

ajv.addFormat('date-time',
    {
        validate: (dateTimeString) => moment(dateTimeString, DATE_FORMAT.DEFAULT, true).isValid(),

    }
);

const validateSchema = ajv.compile(productSchema);
validateErrors = (errors) => errors.map(error => `${error.instancePath ? error.instancePath : ''} ${error.message}`.trim());


const validateProduct = (body) => {
    return { isValid: validateSchema(body), errors: validateErrors(validateSchema.errors || []) }
}

const validateProductLaunch = (body) => {
    if (!body._id)
        return { isValid: false, errors: ["must have required property '_id'"] }
    else
        return { isValid: true, errors: [] }
}

module.exports = { validateProduct, validateProductLaunch }