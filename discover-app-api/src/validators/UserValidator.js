const Schema = require("fluent-json-schema");
const Ajv = require("ajv");
const userSchema = require("../models/schema/UserSchema.json")
const ajv = new Ajv({ allErrors: true });
// Ajv option allErrors is required
require("ajv-errors")(ajv);
const validateSchema = ajv.compile(userSchema);
const validateErrors = (errors) => errors.map(error => `${error.instancePath?error.instancePath:''} ${error.message}`.trim());

const validateUser = (body) => {
    return { isValid: validateSchema(body), errors: validateErrors(validateSchema.errors || []) }
}

const validateFollowUser = (_id, _idFollowUser) => {

    const errors = [];
    let isValid = true;
    if (!_id) { errors.push("must have required property path '_id'"); isValid = false; }
    if (!_idFollowUser) { errors.push("must have required property path '_idFollowUser'"); isValid = false; }

    return { isValid: isValid, errors: errors }

}

const validateUnfollowUser = (_id, _idFollowUser) => {

    const errors = [];
    let isValid = true;
    if (!_id) { errors.push("must have required property path '_id'"); isValid = false; }
    if (!_idFollowUser) { errors.push("must have required property path '_idUnfollowUser'"); isValid = false; }

    return { isValid: isValid, errors: errors }

}

module.exports = {validateErrors, validateUser, validateFollowUser, validateUnfollowUser }